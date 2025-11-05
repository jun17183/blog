import { NextRequest, NextResponse } from 'next/server';
import { cleanupUnusedImages } from '@/lib/imageUtils';
import { savePost, readPost, deletePost, listPosts } from '@/lib/postStorage';

/**
 * 고유한 slug 생성 (중복 방지)
 * @param title - 게시글 제목
 * @param excludePostId - 중복 체크에서 제외할 게시글 ID (수정 시 사용)
 */
async function generateUniqueSlug(title: string, excludePostId?: string): Promise<string> {
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

  // 기존 게시글들의 slug 확인 (Vercel에서는 Blob Storage, 로컬에서는 파일 시스템)
  try {
    const listResult = await listPosts();
    if (!listResult.success || !listResult.posts) {
      return baseSlug;
    }

    const existingSlugs = new Set<string>();
    const matter = await import('gray-matter');

    for (const post of listResult.posts) {
      // 수정 중인 게시글은 제외
      if (excludePostId && post.id === excludePostId) {
        continue;
      }
      
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
 * 특정 게시글 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 게시글 읽기 (Vercel에서는 Blob Storage, 로컬에서는 파일 시스템)
    const readResult = await readPost(id);
    if (!readResult.success || !readResult.content) {
      return NextResponse.json({ error: readResult.error || 'Post not found' }, { status: 404 });
    }

    const matter = await import('gray-matter');
    const { data: frontmatter, content: markdownContent } = matter.default(readResult.content);
    
    return NextResponse.json({
      success: true,
      post: {
        id,
        ...frontmatter,
        content: markdownContent,
      }
    });

  } catch (error) {
    console.error('Post fetch error:', error);
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}

/**
 * 게시글 수정
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string | undefined;
  try {
    const resolvedParams = await params;
    id = resolvedParams.id;
    const { content, title, tags } = await request.json();

    if (!content || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 기존 파일 읽기
    const readResult = await readPost(id);
    if (!readResult.success || !readResult.content) {
      throw new Error(readResult.error || 'Post not found');
    }

    const matter = await import('gray-matter');
    const { data: existingFrontmatter } = matter.default(readResult.content);

    // 고유한 slug 생성 (제목이 변경된 경우에만)
    // 현재 수정 중인 게시글의 slug는 중복 체크에서 제외
    const uniqueSlug = title !== existingFrontmatter.title 
      ? await generateUniqueSlug(title, id)
      : existingFrontmatter.slug;

    // 새로운 마크다운 파일 생성
    const newFrontmatter = `---
title: "${title}"
slug: "${uniqueSlug}"
date: "${existingFrontmatter.date}"  # 기존 날짜 유지
updated: "${new Date().toISOString()}"  # 수정일 추가
tags: ${JSON.stringify(tags || [])}
published: true
---

${content}`;

    // 게시글 저장 (Blob Storage)
    const saveResult = await savePost(id, newFrontmatter);
    if (!saveResult.success) {
      console.error('Save post failed:', saveResult.error);
      throw new Error(saveResult.error || 'Failed to save post');
    }

    // 저장 후 바로 읽어서 확인 (디버깅용)
    const verifyResult = await readPost(id);
    if (!verifyResult.success || !verifyResult.content) {
      console.warn('Warning: Post saved but could not be verified:', verifyResult.error);
    } else {
      console.log('Post saved and verified successfully');
    }

    // 사용하지 않는 이미지들 정리
    const usedImageNames = extractImageNamesFromContent(content);
    await cleanupUnusedImages(id, usedImageNames);

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully',
      postId: id
    });

  } catch (error) {
    console.error('Post update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = error instanceof Error && 'code' in error ? String(error.code) : undefined;
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { 
      errorMessage, 
      errorCode,
      errorStack, 
      id,
      NODE_ENV: process.env.NODE_ENV
    });
    
    // 에러 메시지 생성
    const userErrorMessage = `게시글 수정 실패: ${errorMessage}`;
    
    return NextResponse.json({ 
      success: false,
      error: userErrorMessage,
      details: errorMessage, // 항상 details에도 전체 에러 메시지 포함
      errorCode
    }, { status: 500 });
  }
}

/**
 * 게시글 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string | undefined;
  try {
    const resolvedParams = await params;
    id = resolvedParams.id;
    
    // 게시글 삭제 (Blob Storage)
    const deleteResult = await deletePost(id);
    if (!deleteResult.success) {
      throw new Error(deleteResult.error || 'Failed to delete post');
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Post delete error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { errorMessage, errorStack, id });
    return NextResponse.json({ 
      error: 'Failed to delete post',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
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
