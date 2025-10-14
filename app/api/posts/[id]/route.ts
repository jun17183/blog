import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, rm, readdir } from 'fs/promises';
import { join } from 'path';
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
 * 특정 게시글 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filePath = join(CONTENTS_DIR, id, 'post.md');
    
    const content = await readFile(filePath, 'utf-8');
    const matter = await import('gray-matter');
    const { data: frontmatter, content: markdownContent } = matter.default(content);
    
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
  try {
    const { id } = await params;
    const { content, title, tags, excerpt } = await request.json();

    if (!content || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const filePath = join(CONTENTS_DIR, id, 'post.md');
    
    // 기존 파일 읽기
    const existingContent = await readFile(filePath, 'utf-8');
    const matter = await import('gray-matter');
    const { data: existingFrontmatter } = matter.default(existingContent);

    // 고유한 slug 생성 (제목이 변경된 경우에만)
    const uniqueSlug = title !== existingFrontmatter.title 
      ? await generateUniqueSlug(title)
      : existingFrontmatter.slug;

    // 새로운 마크다운 파일 생성
    const newFrontmatter = `---
title: "${title}"
slug: "${uniqueSlug}"
date: "${existingFrontmatter.date}"  # 기존 날짜 유지
updated: "${new Date().toISOString().split('T')[0]}"  # 수정일 추가
tags: ${JSON.stringify(tags || [])}
excerpt: "${excerpt || ''}"
published: true
---

${content}`;

    await writeFile(filePath, newFrontmatter, 'utf-8');

    // 사용하지 않는 이미지들 정리
    const usedImageNames = extractImageNamesFromContent(content);
    await cleanupUnusedImages(id, usedImageNames);

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully'
    });

  } catch (error) {
    console.error('Post update error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

/**
 * 게시글 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postDir = join(CONTENTS_DIR, id);
    
    // 전체 게시글 폴더 삭제 (마크다운 파일 + 이미지들)
    await rm(postDir, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Post delete error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
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
