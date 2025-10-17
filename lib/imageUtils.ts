import { mkdir, rm, readdir } from 'fs/promises';
import { join } from 'path';

const CONTENTS_DIR = join(process.cwd(), 'contents');

/**
 * 게시글 폴더 및 이미지 폴더 생성
 */
export async function createPostImageDir(postId: string): Promise<void> {
  const postDir = join(CONTENTS_DIR, postId);
  const imageDir = join(postDir, 'images');
  await mkdir(imageDir, { recursive: true });
}

/**
 * 게시글 폴더 삭제 (전체 폴더 삭제)
 */
export async function deletePostImageDir(postId: string): Promise<void> {
  const dirPath = join(CONTENTS_DIR, postId);
  try {
    await rm(dirPath, { recursive: true, force: true });
  } catch {
    console.error('Failed to delete post directory');
  }
}

/**
 * 게시글의 모든 이미지 파일 목록 조회
 */
export async function getPostImages(postId: string): Promise<string[]> {
  const imageDir = join(CONTENTS_DIR, postId, 'images');
  try {
    const files = await readdir(imageDir);
    return files.filter(file => 
      file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );
  } catch {
    return [];
  }
}

/**
 * 특정 이미지들 삭제 (수정 취소 시 사용)
 */
export async function deleteSpecificImages(postId: string, imageNames: string[]): Promise<void> {
  const imageDir = join(CONTENTS_DIR, postId, 'images');
  try {
    for (const fileName of imageNames) {
      await rm(join(imageDir, fileName), { force: true });
    }
  } catch (error) {
    console.error('Failed to delete specific images:', error);
  }
}

/**
 * 사용하지 않는 이미지들 정리 (게시글 저장 시 사용)
 */
export async function cleanupUnusedImages(postId: string, usedImageNames: string[]): Promise<void> {
  const imageDir = join(CONTENTS_DIR, postId, 'images');
  try {
    const files = await readdir(imageDir);
    const unusedFiles = files.filter(file => 
      file.match(/\.(jpg|jpeg|png|gif|webp)$/i) && !usedImageNames.includes(file)
    );
    
    for (const file of unusedFiles) {
      await rm(join(imageDir, file), { force: true });
    }
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
