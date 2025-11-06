import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { list } from '@vercel/blob';

const CONTENTS_DIR = join(process.cwd(), 'contents');

// 이미지는 변경되지 않는 정적 파일이므로 적극적으로 캐싱
export const dynamic = 'force-static'; // 빌드 시 생성 가능하면 정적으로
export const revalidate = false; // 무제한 캐싱 (이미지는 변경되지 않음)

/**
 * 이미지 서빙 API
 * - Vercel 환경: Blob Storage에서 이미지 조회
 * - 로컬 환경: contents/[postId]/images/[fileName] 경로의 이미지 서빙
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

    // 1. Blob Storage 우선 확인 (Vercel 환경)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { blobs } = await list({
          prefix: `${postId}/`,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        // 해당 파일명을 가진 blob 찾기
        const imageBlob = blobs.find(blob => blob.pathname.endsWith(`/${fileName}`));
        
        if (imageBlob) {
          // Blob Storage에서 이미지 가져오기
          const response = await fetch(imageBlob.url);
          const imageBuffer = await response.arrayBuffer();
          
          // Content-Type 결정
          const extension = fileName.split('.').pop()?.toLowerCase();
          const contentType = getContentType(extension || '');

          return new NextResponse(imageBuffer, {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000, immutable, s-maxage=31536000',
              'CDN-Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      } catch (blobError) {
        console.warn('Blob Storage image fetch failed, trying local:', blobError);
        // Blob Storage 실패 시 로컬 파일 시스템으로 fallback
      }
    }

    // 2. 로컬 파일 시스템 확인 (fallback)
    const filePath = join(CONTENTS_DIR, postId, 'images', fileName);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // 이미지 파일 읽기
    const fileBuffer = await readFile(filePath);
    
    // Content-Type 결정
    const extension = fileName.split('.').pop()?.toLowerCase();
    const contentType = getContentType(extension || '');

    // 이미지 응답 (Buffer를 Uint8Array로 변환)
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable, s-maxage=31536000',
        'CDN-Cache-Control': 'public, max-age=31536000, immutable',
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

