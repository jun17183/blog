import { put, list, del } from '@vercel/blob';

/**
 * 이미지 업로드 (Blob Storage 사용)
 */
export async function uploadImageToPublic(
  file: File,
  postId: string,
  fileName: string
): Promise<{ success: boolean; imageUrl?: string; markdownImage?: string; error?: string }> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return {
        success: false,
        error: 'BLOB_READ_WRITE_TOKEN is not configured. Please set it in your environment variables (.env.local for local development, or Vercel dashboard for production)'
      };
    }

    const blobPath = `${postId}/${fileName}`;
    const blob = await put(blobPath, file, {
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const imageUrl = blob.url;
    const markdownImage = `![${file.name}](${imageUrl})`;

    return {
      success: true,
      imageUrl,
      markdownImage
    };
  } catch (error) {
    console.error('Blob Storage error:', error);
    return {
      success: false,
      error: `Blob Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 이미지 삭제 (Blob Storage 사용)
 */
export async function deleteImageFromPublic(postId: string, fileName: string): Promise<boolean> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not configured');
      return false;
    }

    // Blob Storage에서 해당 이미지 찾기
    const { blobs } = await list({
      prefix: `${postId}/`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const imageBlob = blobs.find(blob => blob.pathname.endsWith(fileName));
    if (!imageBlob) {
      console.warn(`Image not found: ${postId}/${fileName}`);
      return false;
    }

    // Blob 삭제
    await del(imageBlob.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return true;
  } catch (error) {
    console.error('Image deletion error:', error);
    return false;
  }
}

/**
 * 게시글의 모든 이미지 삭제 (Blob Storage 사용)
 */
export async function deletePostImagesFromPublic(postId: string): Promise<boolean> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not configured');
      return false;
    }

    // Blob Storage에서 해당 게시글의 모든 이미지 찾기
    const { blobs } = await list({
      prefix: `${postId}/`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // 이미지 파일만 필터링 (post.md 제외)
    const imageBlobs = blobs.filter(blob => !blob.pathname.endsWith('post.md'));

    // 모든 이미지 삭제
    await Promise.all(
      imageBlobs.map(blob => del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN! }))
    );

    return true;
  } catch (error) {
    console.error('Post images deletion error:', error);
    return false;
  }
}
