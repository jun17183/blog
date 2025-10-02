'use client'
import { useState } from 'react';
import MarkdownEditor from './components/MarkdownEditor';
import EditorFooter from './components/EditorFooter';
import TagInput from './components/TagInput';
import { useDarkMode } from '../blog/components/DarkModeProvider';

export default function EditorPage() {
  const { isDarkMode } = useDarkMode();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handlePublish = () => {
    console.log('출간:', { title, tags });
    // 출간 로직 구현
  };

  return (
    <div className="h-full flex flex-col">
      {/* 제목 입력 */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요..."
          className={`w-full px-0 py-2 text-2xl font-bold border-none outline-none bg-transparent ${
            isDarkMode 
              ? 'text-white placeholder-gray-400' 
              : 'text-gray-900 placeholder-gray-500'
          }`}
        />
        <TagInput
          tags={tags}
          onTagsChange={setTags}
          isDarkMode={isDarkMode}
          placeholder="태그를 입력하세요"
        />
      </div>

      {/* 마크다운 에디터 - 남은 공간을 모두 사용 */}
      <div className="flex-1">
        <MarkdownEditor isDarkMode={isDarkMode} />
      </div>

      {/* 하단 푸터 */}
      <EditorFooter 
        isDarkMode={isDarkMode}
        isEdit={false}
        onPublish={handlePublish}
      />
    </div>
  );
}
