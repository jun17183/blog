'use client'
import React from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import ActionButtons from './ActionButtons';
import { darkModeAtom, showSearchAtom, showTagsAtom, toggleSearchAtom, toggleTagsAtom, authAtom } from '@/atoms/blogAtoms';
import { cn } from '@/lib/utils';

export default function BlogHeader() {
  const [isDarkMode] = useAtom(darkModeAtom);
  const [showSearch] = useAtom(showSearchAtom);
  const [showTags] = useAtom(showTagsAtom);
  const [, toggleSearch] = useAtom(toggleSearchAtom);
  const [, toggleTags] = useAtom(toggleTagsAtom);
  const [auth] = useAtom(authAtom);
  const { data: session } = useSession();

  return (
    <>
      <header className={cn(
        'sticky top-0 z-50 transition-colors duration-200 backdrop-blur-sm',
        {
          'bg-gray-900/95 shadow-lg shadow-gray-900/20 border-b border-gray-700': isDarkMode,
          'bg-white/95 shadow-lg shadow-gray-200/50': !isDarkMode,
        }
      )}>
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
                {/* 관리자만 새 글 작성 버튼 표시 */}
                {(auth.isAdmin || session?.isAdmin) && (
                  <Link href="/editor" className={cn(
                    'hover:text-blue-500 transition-colors',
                    {
                      'text-gray-300 hover:text-blue-400': isDarkMode,
                      'text-gray-700': !isDarkMode,
                    }
                  )}>
                    새 글 작성
                  </Link>
                )}
                
              </nav>
              
              {/* Action Buttons */}
              <ActionButtons
                showSearch={showSearch}
                showTags={showTags}
                currentPage="list"
                onSearchClick={toggleSearch}
                onTagsClick={toggleTags}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}