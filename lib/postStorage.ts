import { put, list, del } from '@vercel/blob';

/**
 * 게시글 저장 (Blob Storage 사용)
 */
export async function savePost(
  postId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return {
        success: false,
        error: 'BLOB_READ_WRITE_TOKEN is not configured. Please set it in your environment variables (.env.local for local development, or Vercel dashboard for production)'
      };
    }

    const blobPath = `posts/${postId}/post.md`;
    await put(blobPath, content, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true, // 기존 Blob 덮어쓰기 허용 (게시글 수정용)
      token: process.env.BLOB_READ_WRITE_TOKEN,
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
 * 게시글 읽기 (Blob Storage 사용)
 */
export async function readPost(postId: string): Promise<{ success: boolean; content?: string; error?: string }> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return {
        success: false,
        error: 'BLOB_READ_WRITE_TOKEN is not configured'
      };
    }

    // Blob Storage에서 읽기
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

    // 캐시 무시를 위해 URL에 타임스탬프 추가
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
 * 게시글 삭제 (Blob Storage 사용)
 */
export async function deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return {
        success: false,
        error: 'BLOB_READ_WRITE_TOKEN is not configured'
      };
    }

    const { blobs } = await list({
      prefix: `posts/${postId}/`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // 게시글 관련 모든 Blob 삭제
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
 * 모든 게시글 목록 가져오기 (Blob Storage 사용)
 */
export async function listPosts(): Promise<{ success: boolean; posts?: Array<{ id: string; content: string }>; error?: string }> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return {
        success: false,
        error: 'BLOB_READ_WRITE_TOKEN is not configured'
      };
    }

    const { blobs } = await list({
      prefix: 'posts/',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // post.md 파일만 필터링
    const postBlobs = blobs.filter(blob => blob.pathname.endsWith('/post.md'));
    
    // 각 게시글 읽기 (캐시 무시)
    const posts = await Promise.all(
      postBlobs.map(async (blob) => {
        try {
          // 캐시 무시를 위해 URL에 타임스탬프 추가
          const cacheBuster = `?t=${Date.now()}`;
          const response = await fetch(blob.url + cacheBuster, {
            cache: 'no-store',
          });
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
  } catch (error) {
    console.error('Blob Storage list error:', error);
    return {
      success: false,
      error: `Blob Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
