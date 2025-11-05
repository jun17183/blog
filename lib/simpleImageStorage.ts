import { put, list, del } from '@vercel/blob';
import { uploadImageLocal, deleteImageLocal, cleanupImagesLocal } from './localImageStorage';

// 환경 확인: Vercel Blob Storage 사용 여부
const useLocalStorage = !process.env.BLOB_READ_WRITE_TOKEN || process.env.USE_LOCAL_STORAGE === 'true';

/**
 * 이미지 업로드 (환경에 따라 로컬 또는 Blob Storage 사용)
 */
export async function uploadImageToPublic(
  file: File,
  postId: string,
  fileName: string
): Promise<{ success: boolean; imageUrl?: string; markdownImage?: string; error?: string }> {
  try {
    // 로컬 파일 시스템 사용
    if (useLocalStorage) {
      console.log('[Image Storage] Using local file system');
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const result = await uploadImageLocal(postId, fileName, buffer);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error
        };
      }

      const imageUrl = result.url!;
      const markdownImage = `![${file.name}](${imageUrl})`;

      return {
        success: true,
        imageUrl,
        markdownImage
      };
    }

    // Vercel Blob Storage 사용
    console.log('[Image Storage] Using Vercel Blob Storage');
    const blobPath = `${postId}/${fileName}`;
    const blob = await put(blobPath, file, {
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });

    const imageUrl = blob.url;
    const markdownImage = `![${file.name}](${imageUrl})`;

    return {
      success: true,
      imageUrl,
      markdownImage
    };
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: `Image upload error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 이미지 삭제 (환경에 따라 로컬 또는 Blob Storage 사용)
 */
export async function deleteImageFromPublic(postId: string, fileName: string): Promise<boolean> {
  try {
    // 로컬 파일 시스템 사용
    if (useLocalStorage) {
      const result = await deleteImageLocal(postId, fileName);
      return result.success;
    }

    // Vercel Blob Storage 사용
    const { blobs } = await list({
      prefix: `${postId}/`,
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });

    const imageBlob = blobs.find(blob => blob.pathname.endsWith(fileName));
    if (!imageBlob) {
      console.warn(`Image not found: ${postId}/${fileName}`);
      return false;
    }

    await del(imageBlob.url, { token: process.env.BLOB_READ_WRITE_TOKEN! });
    return true;
  } catch (error) {
    console.error('Image deletion error:', error);
    return false;
  }
}

/**
 * 게시글의 모든 이미지 삭제 (환경에 따라 로컬 또는 Blob Storage 사용)
 */
export async function deletePostImagesFromPublic(postId: string): Promise<boolean> {
  try {
    // 로컬 파일 시스템 사용
    if (useLocalStorage) {
      const result = await cleanupImagesLocal(postId);
      return result.success;
    }

    // Vercel Blob Storage 사용
    const { blobs } = await list({
      prefix: `${postId}/`,
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });

    const imageBlobs = blobs.filter(blob => !blob.pathname.endsWith('post.md'));

    await Promise.all(
      imageBlobs.map(blob => del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN! }))
    );

    return true;
  } catch (error) {
    console.error('Post images deletion error:', error);
    return false;
  }
}
