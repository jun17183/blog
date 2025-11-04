import { NextRequest, NextResponse } from 'next/server';
import { generateImageId, isValidImageFile, isValidImageSize } from '@/lib/imageUtils';
import { uploadImageToPublic } from '@/lib/simpleImageStorage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const postId = formData.get('postId') as string;

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

    // 파일명 생성
    const imageId = generateImageId();
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fullFileName = `${imageId}.${fileExtension}`;

    // public 폴더에 이미지 저장 (Vercel에서도 작동)
    const result = await uploadImageToPublic(file, postId, fullFileName);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Upload failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      markdownImage: result.markdownImage,
      fileName: fullFileName,
      fileSize: file.size
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
