import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { put } from '@vercel/blob';

// contents/[id]/images 구조로 이미지 저장
const CONTENTS_DIR = join(process.cwd(), 'contents');

/**
 * 이미지 폴더 생성
 */
export async function createImageDir(postId: string): Promise<void> {
  const imageDir = join(CONTENTS_DIR, postId, 'images');
  await mkdir(imageDir, { recursive: true });
}

/**
 * 이미지 업로드 (Vercel에서는 Blob Storage, 로컬에서는 파일 시스템)
 */
export async function uploadImageToPublic(
  file: File,
  postId: string,
  fileName: string
): Promise<{ success: boolean; imageUrl?: string; markdownImage?: string; error?: string }> {
  try {
    // Vercel 환경에서는 Blob Storage 사용
    if (process.env.VERCEL) {
      const blobPath = `${postId}/${fileName}`;
      const blob = await put(blobPath, file, {
        access: 'public',
        addRandomSuffix: false,
      });

      const imageUrl = blob.url;
      const markdownImage = `![${file.name}](${imageUrl})`;

      return {
        success: true,
        imageUrl,
        markdownImage
      };
    }

    // 로컬 환경에서는 파일 시스템 사용
    await createImageDir(postId);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(CONTENTS_DIR, postId, 'images', fileName);
    
    await writeFile(filePath, buffer);

    // API 라우트를 통해 이미지 서빙
    const imageUrl = `/api/images/${postId}/${fileName}`;
    const markdownImage = `![${file.name}](${imageUrl})`;

    return {
      success: true,
      imageUrl,
      markdownImage
    };

  } catch (error) {
    console.error('Image upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { errorMessage, errorStack });
    
    return {
      success: false,
      error: errorMessage || 'Upload failed'
    };
  }
}

/**
 * 이미지 삭제
 */
export async function deleteImageFromPublic(postId: string, fileName: string): Promise<boolean> {
  try {
    // Vercel 환경에서는 Blob Storage 삭제 (구현 필요)
    if (process.env.VERCEL) {
      // Vercel Blob Storage는 URL을 통해 삭제해야 함
      // 현재는 삭제 기능을 사용하지 않으므로 일단 true 반환
      console.warn('Image deletion not implemented for Vercel Blob Storage');
      return true;
    }

    // 로컬 환경에서는 파일 시스템에서 삭제
    const filePath = join(CONTENTS_DIR, postId, 'images', fileName);
    await rm(filePath, { force: true });
    return true;
  } catch (error) {
    console.error('Image deletion error:', error);
    return false;
  }
}

/**
 * 게시글의 모든 이미지 삭제
 */
export async function deletePostImagesFromPublic(postId: string): Promise<boolean> {
  try {
    // Vercel 환경에서는 Blob Storage 삭제 (구현 필요)
    if (process.env.VERCEL) {
      // Vercel Blob Storage는 URL을 통해 삭제해야 함
      // 현재는 삭제 기능을 사용하지 않으므로 일단 true 반환
      console.warn('Post images deletion not implemented for Vercel Blob Storage');
      return true;
    }

    // 로컬 환경에서는 파일 시스템에서 삭제
    const imageDir = join(CONTENTS_DIR, postId, 'images');
    await rm(imageDir, { recursive: true, force: true });
    return true;
  } catch (error) {
    console.error('Post images deletion error:', error);
    return false;
  }
}
