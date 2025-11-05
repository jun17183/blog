import { list, del } from '@vercel/blob';

/**
 * 게시글의 모든 이미지 파일 목록 조회 (Blob Storage 사용)
 */
export async function getPostImages(postId: string): Promise<string[]> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return [];
    }

    const { blobs } = await list({
      prefix: `${postId}/`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // 이미지 파일만 필터링 (post.md 제외)
    return blobs
      .filter(blob => {
        const pathname = blob.pathname;
        return pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i) && !pathname.endsWith('post.md');
      })
      .map(blob => {
        // 파일명 추출: {postId}/{fileName}
        const match = blob.pathname.match(/\/([^\/]+)$/);
        return match ? match[1] : '';
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * 사용하지 않는 이미지들 정리 (게시글 저장 시 사용, Blob Storage 사용)
 */
export async function cleanupUnusedImages(postId: string, usedImageNames: string[]): Promise<void> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN is not configured, skipping cleanup');
      return;
    }

    const { blobs } = await list({
      prefix: `${postId}/`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // 이미지 파일만 필터링 (post.md 제외)
    const imageBlobs = blobs.filter(blob => {
      const pathname = blob.pathname;
      return pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i) && !pathname.endsWith('post.md');
    });

    // 사용하지 않는 이미지 찾기
    const unusedBlobs = imageBlobs.filter(blob => {
      const match = blob.pathname.match(/\/([^\/]+)$/);
      const fileName = match ? match[1] : '';
      return fileName && !usedImageNames.includes(fileName);
    });

    // 사용하지 않는 이미지 삭제
    await Promise.all(
      unusedBlobs.map(blob => del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN! }))
    );
  } catch (error) {
    console.error('Failed to cleanup unused images:', error);
  }
}

/**
 * 이미지 ID 생성
 */
export function generateImageId(): string {
  return 'img_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 이미지 파일 확장자 검증
 */
export function isValidImageFile(fileName: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return validExtensions.includes(extension);
}

/**
 * 이미지 파일 크기 검증 (5MB 제한)
 */
export function isValidImageSize(fileSize: number): boolean {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return fileSize <= maxSize;
}
