import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';

// Vercel에서도 작동하는 간단한 이미지 저장 방식
const PUBLIC_IMAGES_DIR = join(process.cwd(), 'public', 'images');

/**
 * 이미지 폴더 생성
 */
export async function createImageDir(postId: string): Promise<void> {
  const postDir = join(PUBLIC_IMAGES_DIR, postId);
  await mkdir(postDir, { recursive: true });
}

/**
 * 이미지 업로드 (public 폴더에 저장)
 */
export async function uploadImageToPublic(
  file: File,
  postId: string,
  fileName: string
): Promise<{ success: boolean; imageUrl?: string; markdownImage?: string; error?: string }> {
  try {
    // 이미지 폴더 생성
    await createImageDir(postId);

    // 파일 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(PUBLIC_IMAGES_DIR, postId, fileName);
    
    await writeFile(filePath, buffer);

    // public 폴더의 이미지는 직접 접근 가능
    const imageUrl = `/images/${postId}/${fileName}`;
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
      error: 'Upload failed'
    };
  }
}

/**
 * 이미지 삭제
 */
export async function deleteImageFromPublic(postId: string, fileName: string): Promise<boolean> {
  try {
    const filePath = join(PUBLIC_IMAGES_DIR, postId, fileName);
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
    const postDir = join(PUBLIC_IMAGES_DIR, postId);
    await rm(postDir, { recursive: true, force: true });
    return true;
  } catch (error) {
    console.error('Post images deletion error:', error);
    return false;
  }
}
