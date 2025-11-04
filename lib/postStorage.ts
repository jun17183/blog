import { writeFile, mkdir, readFile, rm, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { put, list, del } from '@vercel/blob';

const CONTENTS_DIR = join(process.cwd(), 'contents');

/**
 * 게시글 저장 (Vercel에서는 Blob Storage, 로컬에서는 파일 시스템)
 */
export async function savePost(
  postId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vercel 환경에서는 Blob Storage 사용
    if (process.env.VERCEL) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return {
          success: false,
          error: 'BLOB_READ_WRITE_TOKEN is not configured. Please set it in Vercel dashboard: Settings > Environment Variables'
        };
      }

      try {
        const blobPath = `posts/${postId}/post.md`;
        await put(blobPath, content, {
          access: 'public',
          addRandomSuffix: false,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return { success: true };
      } catch (blobError) {
        console.error('Blob Storage error:', blobError);
        return {
          success: false,
          error: `Blob Storage error: ${blobError instanceof Error ? blobError.message : 'Unknown error'}`
        };
      }
    }

    // 로컬 환경에서는 파일 시스템 사용
    const postDir = join(CONTENTS_DIR, postId);
    await mkdir(postDir, { recursive: true });
    const filePath = join(postDir, 'post.md');
    await writeFile(filePath, content, 'utf-8');

    return { success: true };
  } catch (error) {
    console.error('Post save error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * 게시글 읽기 (Vercel에서는 Blob Storage, 로컬에서는 파일 시스템)
 */
export async function readPost(postId: string): Promise<{ success: boolean; content?: string; error?: string }> {
  try {
    // Vercel 환경에서는 Blob Storage 사용
    if (process.env.VERCEL) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return {
          success: false,
          error: 'BLOB_READ_WRITE_TOKEN is not configured'
        };
      }

      try {
        // Blob Storage에서 읽기 (URL을 통해)
        // 실제로는 list API를 사용하여 URL을 찾아야 함
        // 하지만 현재는 파일 시스템과 호환을 위해 동일한 구조 사용
        const { blobs } = await list({
          prefix: `posts/${postId}/`,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        const postBlob = blobs.find(blob => blob.pathname.endsWith('post.md'));
        if (!postBlob) {
          return {
            success: false,
            error: 'Post not found'
          };
        }

        const response = await fetch(postBlob.url);
        const content = await response.text();

        return { success: true, content };
      } catch (blobError) {
        console.error('Blob Storage read error:', blobError);
        return {
          success: false,
          error: `Blob Storage error: ${blobError instanceof Error ? blobError.message : 'Unknown error'}`
        };
      }
    }

    // 로컬 환경에서는 파일 시스템 사용
    const filePath = join(CONTENTS_DIR, postId, 'post.md');
    const content = await readFile(filePath, 'utf-8');

    return { success: true, content };
  } catch (error) {
    console.error('Post read error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * 게시글 삭제 (Vercel에서는 Blob Storage, 로컬에서는 파일 시스템)
 */
export async function deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Vercel 환경에서는 Blob Storage 사용
    if (process.env.VERCEL) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return {
          success: false,
          error: 'BLOB_READ_WRITE_TOKEN is not configured'
        };
      }

      try {
        const { blobs } = await list({
          prefix: `posts/${postId}/`,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        // 게시글 관련 모든 Blob 삭제
        await Promise.all(
          blobs.map(blob => del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN! }))
        );

        return { success: true };
      } catch (blobError) {
        console.error('Blob Storage delete error:', blobError);
        return {
          success: false,
          error: `Blob Storage error: ${blobError instanceof Error ? blobError.message : 'Unknown error'}`
        };
      }
    }

    // 로컬 환경에서는 파일 시스템 사용
    const postDir = join(CONTENTS_DIR, postId);
    await rm(postDir, { recursive: true, force: true });

    return { success: true };
  } catch (error) {
    console.error('Post delete error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * 모든 게시글 목록 가져오기 (Vercel에서는 Blob Storage, 로컬에서는 파일 시스템)
 */
export async function listPosts(): Promise<{ success: boolean; posts?: Array<{ id: string; content: string }>; error?: string }> {
  try {
    // Vercel 환경에서는 Blob Storage 사용
    if (process.env.VERCEL) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return {
          success: false,
          error: 'BLOB_READ_WRITE_TOKEN is not configured'
        };
      }

      try {
        const { blobs } = await list({
          prefix: 'posts/',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        // post.md 파일만 필터링
        const postBlobs = blobs.filter(blob => blob.pathname.endsWith('/post.md'));
        
        // 각 게시글 읽기
        const posts = await Promise.all(
          postBlobs.map(async (blob) => {
            try {
              const response = await fetch(blob.url);
              const content = await response.text();
              // postId 추출: posts/{postId}/post.md
              const match = blob.pathname.match(/posts\/([^\/]+)\/post\.md/);
              const id = match ? match[1] : '';
              return { id, content };
            } catch {
              return null;
            }
          })
        );

        return {
          success: true,
          posts: posts.filter((p): p is { id: string; content: string } => p !== null)
        };
      } catch (blobError) {
        console.error('Blob Storage list error:', blobError);
        return {
          success: false,
          error: `Blob Storage error: ${blobError instanceof Error ? blobError.message : 'Unknown error'}`
        };
      }
    }

    // 로컬 환경에서는 파일 시스템 사용
    const files = await readdir(CONTENTS_DIR);
    const postDirs = await Promise.all(
      files.map(async (file) => {
        const filePath = join(CONTENTS_DIR, file);
        const stats = await stat(filePath);
        return stats.isDirectory() ? file : null;
      })
    );

    const validPostDirs = postDirs.filter((dir): dir is string => dir !== null);

    const posts = await Promise.all(
      validPostDirs.map(async (postId) => {
        try {
          const filePath = join(CONTENTS_DIR, postId, 'post.md');
          const content = await readFile(filePath, 'utf-8');
          return { id: postId, content };
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
    console.error('Post list error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage
    };
  }
}
