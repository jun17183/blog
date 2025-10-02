'use client'
import React from 'react';
import Link from 'next/link';
import ActionButtons from './ActionButtons';
import { useSearch } from '../hooks/useSearch';
import { useTags } from '../hooks/useTags';

interface BlogHeaderProps {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

export default function BlogHeader({ 
  isDarkMode, 
  onDarkModeToggle
}: BlogHeaderProps) {
  const { showSearch, handleToggleSearch } = useSearch();
  const { showTags, handleToggleTags } = useTags();

  return (
    <>
      <header className={`sticky top-0 z-50 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900/95 shadow-lg shadow-gray-900/20 border-b border-gray-700' : 'bg-white/95 shadow-lg shadow-gray-200/50'
      } backdrop-blur-sm`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">
              <Link href="/" className="hover:text-blue-500 transition-colors">
                jun17183
              </Link>
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Navigation */}
              <nav className="hidden md:flex space-x-6">
                <Link href="/editor" className={`hover:text-blue-500 transition-colors ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700'
                }`}>
                  새 글 작성
                </Link>
              </nav>
              
              {/* Action Buttons */}
              <ActionButtons
                isDarkMode={isDarkMode}
                showSearch={showSearch}
                showTags={showTags}
                currentPage="list"
                onSearchClick={handleToggleSearch}
                onTagsClick={handleToggleTags}
                onDarkModeToggle={onDarkModeToggle}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}