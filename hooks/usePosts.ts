import { useState, useCallback } from 'react';
import { Post, PaginationInfo } from '@/types/blog';

interface UsePostsReturn {
  posts: Post[];
  availableTags: {tag: string, count: number}[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  pagination: PaginationInfo;
  loadPosts: (page?: number, reset?: boolean) => Promise<void>;
  handleDeletePost: (postId: string) => Promise<void>;
}

/**
 * 게시글 관련 로직을 관리하는 커스텀 훅
 */
export function usePosts(selectedTag?: string | null): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [availableTags, setAvailableTags] = useState<{tag: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const loadPosts = useCallback(async (page: number = 1, reset: boolean = true) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        ...(selectedTag && { tag: selectedTag }),
        _t: Date.now().toString() // 캐시 방지용 타임스탬프
      });

      const response = await fetch(`/api/posts?${params}`, {
        cache: 'no-store', // Next.js 캐시 비활성화
        headers: {
          'Cache-Control': 'no-cache', // 브라우저 캐시 비활성화
        }
      });
      const result = await response.json();

      if (result.success) {
        if (reset) {
          setPosts(result.posts);
        } else {
          setPosts(prev => [...prev, ...result.posts]);
        }

        setPagination(result.pagination);

        // 첫 페이지 로드 시에만 태그 통계 계산
        if (page === 1) {
          const allPostsResponse = await fetch(`/api/posts?limit=1000&_t=${Date.now()}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            }
          });
          const allPostsResult = await allPostsResponse.json();

          if (allPostsResult.success) {
            const tagCounts: {[key: string]: number} = {};
            allPostsResult.posts.forEach((post: Post) => {
              post.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              });
            });

            const tagsWithCount = Object.entries(tagCounts)
              .map(([tag, count]) => ({ tag, count }))
              .sort((a, b) => b.count - a.count);

            setAvailableTags(tagsWithCount);
          }
        }
      } else {
        setError('게시글을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedTag]);

  const handleDeletePost = useCallback(async (postId: string) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setPosts(prev => prev.filter(post => post.id !== postId));
        setPagination(prev => ({
          ...prev,
          totalPosts: prev.totalPosts - 1
        }));
        alert('게시글이 삭제되었습니다.');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  }, []);

  return {
    posts,
    availableTags,
    loading,
    loadingMore,
    error,
    pagination,
    loadPosts,
    handleDeletePost
  };
}
