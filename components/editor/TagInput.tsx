'use client'
import { useState, useRef, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ 
  tags, 
  onTagsChange, 
  placeholder = "태그를 입력하세요." 
}: TagInputProps) {
  const [isDarkMode] = useAtom(darkModeAtom);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    // # 제거하고 저장
    const cleanTag = tag.trim().replace(/^#+/, '');
    if (cleanTag && !tags.includes(cleanTag)) {
      onTagsChange([...tags, cleanTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // 빈 입력에서 백스페이스 시 마지막 태그 제거
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 min-h-[40px]">
      {/* 태그들 */}
      {tags.map((tag, index) => (
        <span
          key={index}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm',
            {
              'bg-gray-700 text-gray-200': isDarkMode,
              'bg-gray-100 text-gray-700': !isDarkMode,
            }
          )}
        >
          #{tag}
          <button
            onClick={() => removeTag(tag)}
            className={cn(
              'ml-1 hover:bg-gray-600 rounded-full p-0.5',
              {
                'text-gray-400 hover:text-gray-200': isDarkMode,
                'text-gray-500 hover:text-gray-700': !isDarkMode,
              }
            )}
          >
            ×
          </button>
        </span>
      ))}
      
      {/* 입력 필드 */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? placeholder : ''}
        className={cn(
          'flex-1 min-w-[120px] px-0 py-1 text-sm border-none outline-none bg-transparent',
          {
            'text-gray-400 placeholder-gray-500': isDarkMode,
            'text-gray-600 placeholder-gray-400': !isDarkMode,
          }
        )}
      />
    </div>
  );
}
