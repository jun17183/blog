import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createPostImageDir, generateImageId, isValidImageFile, isValidImageSize } from '@/lib/imageUtils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const postId = formData.get('postId') as string;
    const isTemp = formData.get('isTemp') === 'true';

    if (!file || !postId) {
      return NextResponse.json({ error: 'Missing file or postId' }, { status: 400 });
    }

    // 파일 검증
    if (!isValidImageFile(file.name)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (!isValidImageSize(file.size)) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // 이미지 폴더 생성
    await createPostImageDir(postId);

    // 파일명 생성
    const imageId = generateImageId();
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fullFileName = `${imageId}.${fileExtension}`;

    // 파일 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(process.cwd(), 'contents', postId, 'images', fullFileName);
    
    await writeFile(filePath, buffer);

    // 마크다운 이미지 URL 반환
    const imageUrl = `/api/images/${postId}/images/${fullFileName}`;
    const markdownImage = `![${file.name}](${imageUrl})`;

    return NextResponse.json({
      success: true,
      imageUrl,
      markdownImage,
      fileName: fullFileName,
      fileSize: file.size
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
