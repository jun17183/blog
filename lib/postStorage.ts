import { put, list, del } from '@vercel/blob';
import { 
  savePostLocal, 
  readPostLocal, 
  deletePostLocal, 
  listPostsLocal 
} from './localStorage';

// 환경 확인: Vercel Blob Storage 사용 여부
const useLocalStorage = !process.env.BLOB_READ_WRITE_TOKEN || process.env.USE_LOCAL_STORAGE === 'true';

/**
 * 게시글 저장 (환경에 따라 로컬 또는 Blob Storage 사용)
 */
export async function savePost(
  postId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  // 로컬 파일 시스템 사용
  if (useLocalStorage) {
    console.log('[Storage] Using local file system');
    return savePostLocal(postId, content);
  }

  // Vercel Blob Storage 사용
  try {
    console.log('[Storage] Using Vercel Blob Storage');
    const blobPath = `posts/${postId}/post.md`;
    await put(blobPath, content, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });

    return { success: true };
  } catch (error) {
    console.error('Blob Storage error:', error);
    return {
      success: false,
      error: `Blob Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 게시글 읽기 (환경에 따라 로컬 또는 Blob Storage 사용)
 */
export async function readPost(postId: string): Promise<{ success: boolean; content?: string; error?: string }> {
  // 로컬 파일 시스템 사용
  if (useLocalStorage) {
    return readPostLocal(postId);
  }

  // Vercel Blob Storage 사용
  try {
    const { blobs } = await list({
      prefix: `posts/${postId}/`,
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });

    const postBlob = blobs.find(blob => blob.pathname.endsWith('post.md'));
    if (!postBlob) {
      return {
        success: false,
        error: 'Post not found'
      };
    }

    const cacheBuster = `?t=${Date.now()}`;
    const response = await fetch(postBlob.url + cacheBuster, {
      cache: 'no-store',
    });
    const content = await response.text();

    return { success: true, content };
  } catch (error) {
    console.error('Blob Storage read error:', error);
    return {
      success: false,
      error: `Blob Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 게시글 삭제 (환경에 따라 로컬 또는 Blob Storage 사용)
 */
export async function deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
  // 로컬 파일 시스템 사용
  if (useLocalStorage) {
    return deletePostLocal(postId);
  }

  // Vercel Blob Storage 사용
  try {
    const { blobs } = await list({
      prefix: `posts/${postId}/`,
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });

    await Promise.all(
      blobs.map(blob => del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN! }))
    );

    return { success: true };
  } catch (error) {
    console.error('Blob Storage delete error:', error);
    return {
      success: false,
      error: `Blob Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 모든 게시글 목록 가져오기 (환경에 따라 로컬 또는 Blob Storage 사용)
 */
export async function listPosts(): Promise<{ success: boolean; posts?: Array<{ id: string; content: string }>; error?: string }> {
  // 로컬 파일 시스템 사용
  if (useLocalStorage) {
    return listPostsLocal();
  }

  // Vercel Blob Storage 사용
  try {
    const { blobs } = await list({
      prefix: 'posts/',
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });

    const postBlobs = blobs.filter(blob => blob.pathname.endsWith('/post.md'));
    
    const posts = await Promise.all(
      postBlobs.map(async (blob) => {
        try {
          const cacheBuster = `?t=${Date.now()}`;
          const response = await fetch(blob.url + cacheBuster, {
            cache: 'no-store',
          });
          const content = await response.text();
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
  } catch (error) {
    console.error('Blob Storage list error:', error);
    return {
      success: false,
      error: `Blob Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
