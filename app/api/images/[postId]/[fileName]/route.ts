import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const CONTENTS_DIR = join(process.cwd(), 'contents');

/**
 * 이미지 서빙 API
 * contents/[postId]/images/[fileName] 경로의 이미지를 서빙
 * URL: /api/images/[postId]/[fileName]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; fileName: string }> }
) {
  try {
    const { postId, fileName } = await params;
    
    // 경로 보안 검증 (디렉토리 탐색 공격 방지)
    if (postId.includes('..') || fileName.includes('..')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    // contents/[postId]/images/[fileName] 경로로 파일 읽기
    const filePath = join(CONTENTS_DIR, postId, 'images', fileName);

    // 파일 존재 확인
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // 이미지 파일 읽기
    const fileBuffer = await readFile(filePath);
    
    // Content-Type 결정
    const extension = fileName.split('.').pop()?.toLowerCase();
    const contentType = getContentType(extension || '');

    // 이미지 응답
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Image serve error:', error);
    return NextResponse.json({ error: 'Failed to serve image' }, { status: 500 });
  }
}

/**
 * 파일 확장자에 따른 Content-Type 반환
 */
function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
  };
  
  return contentTypes[extension] || 'application/octet-stream';
}

