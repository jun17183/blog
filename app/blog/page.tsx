'use client'
import React, { useState, useEffect } from 'react';
import PostList from '@/components/blog/PostList';
import SearchSection from '@/components/blog/SearchSection';
import TagsSection from '@/components/blog/TagsSection';
import { useAtom } from 'jotai';
import { 
  darkModeAtom, 
  showSearchAtom, 
  showTagsAtom, 
  searchQueryAtom, 
  selectedTagsAtom, 
  resetFiltersAtom 
} from '../../atoms/blogAtoms';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  updated?: string;
  tags: string[];
  content: string;
}

export default function BlogListPage() {
  const [isDarkMode] = useAtom(darkModeAtom);
  const [showSearch] = useAtom(showSearchAtom);
  const [showTags] = useAtom(showTagsAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom);
  const [, resetFilters] = useAtom(resetFiltersAtom);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게시글 목록 로드
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const result = await response.json();

        if (result.success) {
          setPosts(result.posts);
        } else {
          setError('게시글을 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('Failed to load posts:', error);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // 게시글 삭제
  const handleDeletePost = async (postId: string) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setPosts(posts.filter(post => post.id !== postId));
        alert('게시글이 삭제되었습니다.');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };


  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
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
    <>
      {/* Search Section */}
      {showSearch && (
        <div className="max-w-4xl mx-auto px-4">
          <SearchSection
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            onSearchChange={setSearchQuery}
            onResetFilters={resetFilters}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

      {/* Tags Section */}
      {showTags && (
        <div className="max-w-4xl mx-auto px-4">
          <TagsSection
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

      {/* Post List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PostList 
          posts={posts} 
          isDarkMode={isDarkMode}
          onDeletePost={handleDeletePost}
        />
      </div>
    </>
  );
}