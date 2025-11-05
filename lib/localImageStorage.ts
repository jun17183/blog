import fs from 'fs/promises';
import path from 'path';

const CONTENTS_DIR = path.join(process.cwd(), 'contents');

/**
 * 로컬 파일 시스템을 사용한 이미지 저장
 */
export async function uploadImageLocal(
  postId: string,
  fileName: string,
  buffer: Buffer
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const imagesDir = path.join(CONTENTS_DIR, postId, 'images');
    const imagePath = path.join(imagesDir, fileName);

    // 디렉토리 생성
    await fs.mkdir(imagesDir, { recursive: true });
    
    // 이미지 저장
    await fs.writeFile(imagePath, buffer);

    // 로컬 URL 반환 (/api/images/[postId]/[fileName])
    const url = `/api/images/${postId}/${fileName}`;

    return { success: true, url };
  } catch (error) {
    console.error('Local image upload error:', error);
    return {
      success: false,
      error: `Local image upload error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 로컬 파일 시스템에서 이미지 읽기
 */
export async function readImageLocal(
  postId: string,
  fileName: string
): Promise<{ success: boolean; data?: Buffer; contentType?: string; error?: string }> {
  try {
    const imagePath = path.join(CONTENTS_DIR, postId, 'images', fileName);
    
    // 파일 존재 확인
    try {
      await fs.access(imagePath);
    } catch {
      return {
        success: false,
        error: 'Image not found'
      };
    }

    const data = await fs.readFile(imagePath);
    
    // Content-Type 추론
    const ext = path.extname(fileName).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    return { success: true, data, contentType };
  } catch (error) {
    console.error('Local image read error:', error);
    return {
      success: false,
      error: `Local image read error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 로컬 파일 시스템에서 특정 이미지 삭제
 */
export async function deleteImageLocal(
  postId: string,
  fileName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const imagePath = path.join(CONTENTS_DIR, postId, 'images', fileName);
    
    try {
      await fs.unlink(imagePath);
    } catch {
      // 파일이 없으면 무시
    }

    return { success: true };
  } catch (error) {
    console.error('Local image delete error:', error);
    return {
      success: false,
      error: `Local image delete error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 로컬 파일 시스템에서 게시글의 모든 이미지 삭제
 */
export async function cleanupImagesLocal(
  postId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const imagesDir = path.join(CONTENTS_DIR, postId, 'images');
    
    try {
      await fs.rm(imagesDir, { recursive: true, force: true });
    } catch {
      // 디렉토리가 없으면 무시
    }

    return { success: true };
  } catch (error) {
    console.error('Local cleanup error:', error);
    return {
      success: false,
      error: `Local cleanup error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 로컬 파일 시스템에서 게시글의 이미지 목록 가져오기
 */
export async function listImagesLocal(
  postId: string
): Promise<{ success: boolean; images?: string[]; error?: string }> {
  try {
    const imagesDir = path.join(CONTENTS_DIR, postId, 'images');
    
    try {
      const files = await fs.readdir(imagesDir);
      return { success: true, images: files };
    } catch {
      // 디렉토리가 없으면 빈 배열 반환
      return { success: true, images: [] };
    }
  } catch (error) {
    console.error('Local list images error:', error);
    return {
      success: false,
      error: `Local list images error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

