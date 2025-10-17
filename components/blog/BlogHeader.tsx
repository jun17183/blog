'use client'
import React from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import ActionButtons from './ActionButtons';
import { darkModeAtom, showTagsAtom, toggleTagsAtom, authAtom } from '@/atoms/blogAtoms';
import { cn } from '@/lib/utils';

export default function BlogHeader() {
  const [isDarkMode] = useAtom(darkModeAtom);
  const [showTags] = useAtom(showTagsAtom);
  const [, toggleTags] = useAtom(toggleTagsAtom);
  const [auth] = useAtom(authAtom);
  const { data: session } = useSession();

  return (
    <>
      <header className={cn(
        'sticky top-0 z-50 transition-colors duration-200 backdrop-blur-sm',
        {
          'bg-gray-900/95 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.03)] border-b border-gray-700': isDarkMode,
          'bg-white/95 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.03)] border-b border-gray-200': !isDarkMode,
        }
      )}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">
              <Link href="/blog" className="hover:text-blue-500 transition-colors">
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
                showTags={showTags}
                currentPage="list"
                onTagsClick={toggleTags}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}