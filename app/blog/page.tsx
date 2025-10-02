'use client'
import React from 'react';
import PostList from './components/PostList';
import SearchSection from './components/SearchSection';
import TagsSection from './components/TagsSection';
import { useDarkMode } from './components/DarkModeProvider';
import { useSearch } from './hooks/useSearch';
import { useTags } from './hooks/useTags';
import { useAtom } from 'jotai';
import { resetFiltersAtom } from './atoms/blogAtoms';

export default function BlogListPage() {
  const { isDarkMode } = useDarkMode();
  
  const { showSearch, searchQuery, handleSearchChange } = useSearch();
  const { showTags, selectedTags, handleTagsChange } = useTags();
  const [, resetFilters] = useAtom(resetFiltersAtom);

  const posts = [
    {
      id: 1,
      title: 'Next.js로 블로그 만들기',
      slug: 'nextjs-blog-tutorial',
      excerpt: 'Next.js와 마크다운을 활용해서 개인 블로그를 만드는 방법을 알아봅니다...',
      date: '2024.01.01',
      tags: ['Next.js', 'React']
    },
    {
      id: 2,
      title: 'TypeScript 기초부터 심화까지',
      slug: 'typescript-guide',
      excerpt: 'TypeScript의 기본 문법부터 고급 기능까지 차근차근 살펴보겠습니다...',
      date: '2023.12.28',
      tags: ['TypeScript', 'JavaScript']
    },
  ];


  return (
    <>
      {/* Search Section */}
      {showSearch && (
        <div className="max-w-4xl mx-auto px-4">
          <SearchSection
            isDarkMode={isDarkMode}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            onSearchChange={handleSearchChange}
            onResetFilters={resetFilters}
          />
        </div>
      )}

      {/* Tags Section */}
      {showTags && (
        <div className="max-w-4xl mx-auto px-4">
          <TagsSection
            isDarkMode={isDarkMode}
            selectedTags={selectedTags}
            onTagsChange={handleTagsChange}
          />
        </div>
      )}

      {/* Post List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PostList posts={posts} isDarkMode={isDarkMode} />
      </div>
    </>
  );
}