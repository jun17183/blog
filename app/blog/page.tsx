'use client'
import React, { useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useAtom } from 'jotai';
import { 
  darkModeAtom, 
  showTagsAtom, 
  selectedTagAtom
} from '../../atoms/blogAtoms';
import { usePosts } from '@/hooks/usePosts';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// 동적 import로 초기 번들 크기 감소
const PostList = dynamic(() => import('@/components/blog/PostList'), {
  loading: () => <LoadingSpinner size="lg" text="게시글 목록을 불러오는 중..." />
});

const TagsSection = dynamic(() => import('@/components/blog/TagsSection'), {
  loading: () => <LoadingSpinner size="md" text="태그를 불러오는 중..." />
});

/**
 * 블로그 목록 페이지
 * - 무한 스크롤 페이지네이션
 * - 태그 필터 기능
 * - 게시글 삭제 기능
 */
export default function BlogListPage() {
  // Jotai 상태 관리
  const [isDarkMode] = useAtom(darkModeAtom);
  const [showTags] = useAtom(showTagsAtom);
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom);

  // 게시글 관련 로직을 커스텀 훅으로 분리
  const {
    posts,
    availableTags,
    loading,
    loadingMore,
    error,
    pagination,
    loadPosts,
    handleDeletePost
  } = usePosts(selectedTag || undefined);

  // 무한 스크롤을 위한 ref
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const loadPostsRef = useRef<typeof loadPosts | null>(null);

  // loadPosts 함수를 ref에 저장
  useEffect(() => {
    loadPostsRef.current = loadPosts;
  }, [loadPosts]);

  // 초기 로드
  useEffect(() => {
    loadPosts(1, true);
  }, [loadPosts]);

  // Intersection Observer 설정 함수
  const setupIntersectionObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasNextPage && !loadingMore) {
          if (loadPostsRef.current) {
            loadPostsRef.current(pagination.currentPage + 1, false);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [pagination.hasNextPage, loadingMore, pagination.currentPage]);

  // ref 콜백 함수
  const loadMoreRefCallback = useCallback((node: HTMLDivElement | null) => {
    loadMoreRef.current = node;

    if (node) {
      setupIntersectionObserver();
    }
  }, [setupIntersectionObserver]);

  // 페이지네이션 상태 변경 시 Observer 재설정
  useEffect(() => {
    if (loadMoreRef.current) {
      setupIntersectionObserver();
    }
  }, [pagination.hasNextPage, loadingMore, pagination.currentPage, setupIntersectionObserver]);

  if (loading) {
    return <LoadingSpinner size="lg" text="게시글을 불러오는 중..." className="h-screen" />;
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {/* Tags Section */}
      {showTags && (
        <div className="max-w-4xl mx-auto px-4">
          <TagsSection
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
            isDarkMode={isDarkMode}
            availableTags={availableTags}
          />
        </div>
      )}

      {/* Post List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PostList
          posts={posts}
          isDarkMode={isDarkMode}
          onDeletePost={handleDeletePost}
        />

        {/* 무한 스크롤 트리거 */}
        {pagination.hasNextPage && (
          <div ref={loadMoreRefCallback} className="flex justify-center py-8 min-h-[100px]">
            {loadingMore ? (
              <LoadingSpinner size="md" text="더 많은 게시글을 불러오는 중..." />
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                스크롤하여 더 많은 게시글 보기
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}