'use client'
import { useState, useRef, KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  isDarkMode: boolean;
  placeholder?: string;
}

export default function TagInput({ 
  tags, 
  onTagsChange, 
  isDarkMode, 
  placeholder = "태그를 입력하세요" 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
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
    
    // #으로 시작하지 않으면 #을 자동으로 추가
    if (value && !value.startsWith('#')) {
      setInputValue('#' + value);
    } else {
      setInputValue(value);
    }
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
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm ${
            isDarkMode 
              ? 'bg-gray-700 text-gray-200' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className={`ml-1 hover:bg-gray-600 rounded-full p-0.5 ${
              isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
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
        className={`flex-1 min-w-[120px] px-0 py-1 text-sm border-none outline-none bg-transparent ${
          isDarkMode 
            ? 'text-gray-400 placeholder-gray-500' 
            : 'text-gray-600 placeholder-gray-400'
        }`}
      />
    </div>
  );
}
