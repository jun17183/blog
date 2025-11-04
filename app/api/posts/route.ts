import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { generatePostId } from '@/lib/postId';
import { cleanupUnusedImages } from '@/lib/imageUtils';
import { savePost, listPosts } from '@/lib/postStorage';

const CONTENTS_DIR = join(process.cwd(), 'contents');

/**
 * 고유한 slug 생성 (중복 방지)
 */
async function generateUniqueSlug(title: string): Promise<string> {
  // 제목이 비어있거나 공백만 있는 경우 처리
  if (!title || !title.trim()) {
    return 'untitled';
  }

  // 기본 slug 생성 (한글, 영문, 숫자, 하이픈만 허용)
  let baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!baseSlug) {
    baseSlug = 'untitled';
  }

  // 기존 게시글들의 slug 확인
  try {
    const listResult = await listPosts();
    if (!listResult.success || !listResult.posts) {
      return baseSlug;
    }

    const existingSlugs = new Set<string>();
    const matter = await import('gray-matter');

    for (const post of listResult.posts) {
      try {
        const { data: frontmatter } = matter.default(post.content);
        if (frontmatter.slug) {
          existingSlugs.add(frontmatter.slug);
        }
      } catch {
        // 파일 읽기 실패 시 무시
        continue;
      }
    }

    // 중복되지 않는 slug 찾기
    let slug = baseSlug;
    let counter = 1;
    
    while (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  } catch {
    // 디렉토리 읽기 실패 시 기본 slug 반환
    return baseSlug;
  }
}

/**
 * 새 게시글 생성
 */
export async function POST(request: NextRequest) {
  try {
    const { content, title, tags, postId } = await request.json();

    if (!content || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 정식 게시글 ID 생성 (새 글인 경우)
    const finalPostId = postId || generatePostId();
    
    // 고유한 slug 생성
    const uniqueSlug = await generateUniqueSlug(title);
    
    // 마크다운 파일 생성
    const frontmatter = `---
title: "${title}"
slug: "${uniqueSlug}"
date: "${new Date().toISOString()}"
tags: ${JSON.stringify(tags || [])}
published: true
---

${content}`;

    // 게시글 저장 (Vercel에서는 Blob Storage, 로컬에서는 파일 시스템)
    const saveResult = await savePost(finalPostId, frontmatter);
    if (!saveResult.success) {
      throw new Error(saveResult.error || 'Failed to save post');
    }

    // 로컬 환경에서는 디렉토리 구조도 유지 (이미지 저장을 위해)
    if (!process.env.VERCEL) {
      const postDir = join(CONTENTS_DIR, finalPostId);
      await mkdir(postDir, { recursive: true });
      const filePath = join(postDir, 'post.md');
      await writeFile(filePath, frontmatter, 'utf-8');
    }

    // 사용하지 않는 이미지들 정리
    const usedImageNames = extractImageNamesFromContent(content);
    await cleanupUnusedImages(finalPostId, usedImageNames);

    return NextResponse.json({
      success: true,
      postId: finalPostId,
      message: 'Post created successfully'
    });

  } catch (error) {
    console.error('Post creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = error instanceof Error && 'code' in error ? String(error.code) : undefined;
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { 
      errorMessage, 
      errorCode,
      errorStack, 
      CONTENTS_DIR,
      VERCEL: process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV
    });
    
    // Vercel 환경에서 파일 시스템 에러인 경우 명확한 메시지 반환
    const isFileSystemError = errorCode === 'EACCES' || errorCode === 'EROFS' || 
                              errorMessage.includes('read-only') || 
                              errorMessage.includes('EACCES') ||
                              errorMessage.includes('EROFS');
    
    // 에러 메시지 생성 (항상 반환)
    let userErrorMessage = '게시글 저장에 실패했습니다.';
    
    if (isFileSystemError) {
      userErrorMessage = 'Vercel 환경에서는 파일 시스템에 직접 저장할 수 없습니다. 데이터베이스나 Vercel KV/Postgres를 사용해야 합니다.';
    } else {
      userErrorMessage = `게시글 저장 실패: ${errorMessage}`;
    }
    
    return NextResponse.json({ 
      success: false,
      error: userErrorMessage,
      details: errorMessage, // 항상 details에도 전체 에러 메시지 포함
      errorCode
    }, { status: 500 });
  }
}

/**
 * 마크다운 콘텐츠에서 사용된 이미지 파일명 추출
 */
function extractImageNamesFromContent(content: string): string[] {
  // /api/images/[postId]/[fileName] 또는 /images/[postId]/[fileName] 형식 모두 지원
  const imageRegex = /!\[.*?\]\((?:\/api\/images\/[^\/]+\/|\/images\/[^\/]+\/)([^\)]+)\)/g;
  const imageNames: string[] = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    imageNames.push(match[1]);
  }

  return imageNames;
}

/**
 * 게시글 목록 조회 (페이지네이션 지원)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const searchQuery = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    
    const matter = await import('gray-matter');
    
    // 게시글 목록 가져오기 (Vercel에서는 Blob Storage, 로컬에서는 파일 시스템)
    const listResult = await listPosts();
    if (!listResult.success || !listResult.posts) {
      return NextResponse.json({
        success: true,
        posts: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalPosts: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }
    
    const posts = listResult.posts.map(({ id, content }) => {
      try {
        const { data: frontmatter } = matter.default(content);
        return {
          id,
          ...frontmatter,
          content: content.replace(/^---[\s\S]*?---\n/, ''), // frontmatter 제거
        };
      } catch (error) {
        console.error(`Failed to parse post ${id}:`, error);
        return null;
      }
    });

    // null 값 제거 및 날짜순 정렬 (최신순)
    let validPosts = posts.filter(Boolean) as unknown as Array<{ 
      id: string; 
      date: string; 
      title: string;
      content: string;
      tags: string[];
      [key: string]: unknown 
    }>;
    
    validPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      validPosts = validPosts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const contentMatch = post.content.toLowerCase().includes(query);
        const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
        return titleMatch || contentMatch || tagMatch;
      });
    }

    // 태그 필터링
    if (tag.trim()) {
      validPosts = validPosts.filter(post => 
        post.tags.includes(tag)
      );
    }

    // 페이지네이션
    const totalPosts = validPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = validPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      posts: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Posts fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { errorMessage, errorStack, CONTENTS_DIR });
    return NextResponse.json({ 
      error: 'Failed to fetch posts',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}
