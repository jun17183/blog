import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    
    if (pathSegments.length < 3) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const [postId, images, fileName] = pathSegments;
    
    if (images !== 'images') {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const filePath = join(process.cwd(), 'contents', postId, 'images', fileName);
    
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    
    // 파일 확장자에 따른 Content-Type 설정
    const extension = fileName.split('.').pop()?.toLowerCase();
    let contentType = 'image/jpeg';
    
    switch (extension) {
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      default:
        contentType = 'image/jpeg';
    }

    return new NextResponse(fileBuffer as BodyInit, {
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
