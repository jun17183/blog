import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';

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
 * 이미지 업로드 (contents/[id]/images에 저장)
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
    const imageDir = join(CONTENTS_DIR, postId, 'images');
    await rm(imageDir, { recursive: true, force: true });
    return true;
  } catch (error) {
    console.error('Post images deletion error:', error);
    return false;
  }
}
