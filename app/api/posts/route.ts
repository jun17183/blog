import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { generatePostId } from '@/lib/postId';
import { cleanupUnusedImages } from '@/lib/imageUtils';

const CONTENTS_DIR = join(process.cwd(), 'contents');

/**
 * 고유한 slug 생성 (중복 방지)
 */
async function generateUniqueSlug(title: string): Promise<string> {
  // 기본 slug 생성
  let baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!baseSlug) {
    baseSlug = 'untitled';
  }

  // 기존 게시글들의 slug 확인
  try {
    const files = await readdir(CONTENTS_DIR);
    const existingSlugs = new Set<string>();

    for (const file of files) {
      try {
        const filePath = join(CONTENTS_DIR, file, 'post.md');
        const content = await readFile(filePath, 'utf-8');
        const matter = await import('gray-matter');
        const { data: frontmatter } = matter.default(content);
        
        if (frontmatter.slug) {
          existingSlugs.add(frontmatter.slug);
        }
      } catch (error) {
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
  } catch (error) {
    // 디렉토리 읽기 실패 시 기본 slug 반환
    return baseSlug;
  }
}

/**
 * 새 게시글 생성
 */
export async function POST(request: NextRequest) {
  try {
    const { content, title, tags, excerpt, postId } = await request.json();

    if (!content || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 정식 게시글 ID 생성 (새 글인 경우)
    const finalPostId = postId || generatePostId();
    
    // 고유한 slug 생성
    const uniqueSlug = await generateUniqueSlug(title);
    
    // 게시글 폴더 생성
    const postDir = join(CONTENTS_DIR, finalPostId);
    await mkdir(postDir, { recursive: true });

    // 마크다운 파일 생성
    const frontmatter = `---
title: "${title}"
slug: "${uniqueSlug}"
date: "${new Date().toISOString().split('T')[0]}"
tags: ${JSON.stringify(tags || [])}
excerpt: "${excerpt || ''}"
published: true
---

${content}`;

    const filePath = join(postDir, 'post.md');
    await writeFile(filePath, frontmatter, 'utf-8');

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
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

/**
 * 마크다운 콘텐츠에서 사용된 이미지 파일명 추출
 */
function extractImageNamesFromContent(content: string): string[] {
  const imageRegex = /!\[.*?\]\(\/contents\/[^\/]+\/images\/([^\)]+)\)/g;
  const imageNames: string[] = [];
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    imageNames.push(match[1]);
  }
  
  return imageNames;
}

/**
 * 게시글 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { readdir, readFile, stat } = await import('fs/promises');
    const matter = await import('gray-matter');
    
    const files = await readdir(CONTENTS_DIR);
    const postDirs = await Promise.all(
      files.map(async (file) => {
        const filePath = join(CONTENTS_DIR, file);
        const stats = await stat(filePath);
        return stats.isDirectory() ? file : null;
      })
    );
    
    const validPostDirs = postDirs.filter(Boolean);
    
    const posts = await Promise.all(
      validPostDirs.map(async (postId) => {
        const filePath = join(CONTENTS_DIR, postId!, 'post.md');
        try {
          const content = await readFile(filePath, 'utf-8');
          const { data: frontmatter } = matter.default(content);
          
          return {
            id: postId,
            ...frontmatter,
            content: content.replace(/^---[\s\S]*?---\n/, ''), // frontmatter 제거
          };
        } catch (error) {
          console.error(`Failed to read post ${postId}:`, error);
          return null;
        }
      })
    );

    // null 값 제거 및 날짜순 정렬 (최신순)
    const validPosts = posts.filter(Boolean) as unknown as Array<{ id: string; date: string; [key: string]: unknown }>;
    validPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      posts: validPosts
    });

  } catch (error) {
    console.error('Posts fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
