import fs from 'fs/promises';
import path from 'path';

const CONTENTS_DIR = path.join(process.cwd(), 'contents');

/**
 * 로컬 파일 시스템을 사용한 게시글 저장
 */
export async function savePostLocal(
  postId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const postDir = path.join(CONTENTS_DIR, postId);
    const postPath = path.join(postDir, 'post.md');

    // 디렉토리 생성 (이미 존재하면 무시)
    await fs.mkdir(postDir, { recursive: true });
    
    // 게시글 저장
    await fs.writeFile(postPath, content, 'utf-8');

    return { success: true };
  } catch (error) {
    console.error('Local storage error:', error);
    return {
      success: false,
      error: `Local storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 로컬 파일 시스템에서 게시글 읽기
 */
export async function readPostLocal(
  postId: string
): Promise<{ success: boolean; content?: string; error?: string }> {
  try {
    const postPath = path.join(CONTENTS_DIR, postId, 'post.md');
    
    // 파일 존재 확인
    try {
      await fs.access(postPath);
    } catch {
      return {
        success: false,
        error: 'Post not found'
      };
    }

    const content = await fs.readFile(postPath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    console.error('Local storage read error:', error);
    return {
      success: false,
      error: `Local storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 로컬 파일 시스템에서 게시글 삭제
 */
export async function deletePostLocal(
  postId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const postDir = path.join(CONTENTS_DIR, postId);
    
    // 디렉토리 존재 확인
    try {
      await fs.access(postDir);
    } catch {
      return { success: true }; // 이미 없으면 성공으로 간주
    }

    // 디렉토리 전체 삭제 (재귀적)
    await fs.rm(postDir, { recursive: true, force: true });

    return { success: true };
  } catch (error) {
    console.error('Local storage delete error:', error);
    return {
      success: false,
      error: `Local storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 로컬 파일 시스템에서 모든 게시글 목록 가져오기
 */
export async function listPostsLocal(): Promise<{ 
  success: boolean; 
  posts?: Array<{ id: string; content: string }>; 
  error?: string 
}> {
  try {
    // contents 디렉토리 생성 (없으면)
    await fs.mkdir(CONTENTS_DIR, { recursive: true });

    // 모든 하위 디렉토리 목록
    const entries = await fs.readdir(CONTENTS_DIR, { withFileTypes: true });
    const postDirs = entries.filter(entry => entry.isDirectory());

    const posts = await Promise.all(
      postDirs.map(async (dir) => {
        try {
          const postPath = path.join(CONTENTS_DIR, dir.name, 'post.md');
          const content = await fs.readFile(postPath, 'utf-8');
          return { id: dir.name, content };
        } catch {
          return null;
        }
      })
    );

    return {
      success: true,
      posts: posts.filter((p): p is { id: string; content: string } => p !== null)
    };
  } catch (error) {
    console.error('Local storage list error:', error);
    return {
      success: false,
      error: `Local storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

