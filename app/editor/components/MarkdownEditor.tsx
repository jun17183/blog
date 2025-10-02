'use client'
import { useState } from 'react';

interface MarkdownEditorProps {
  initialContent?: string;
  isDarkMode: boolean;
}

export default function MarkdownEditor({ initialContent = '', isDarkMode }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2">
      {/* 마크다운 입력 영역 */}
      <div className="flex flex-col h-full border-r border-gray-200 dark:border-gray-700">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="마크다운 문법으로 작성하세요..."
          className={`flex-1 p-4 border-none resize-none focus:outline-none font-mono text-sm ${
            isDarkMode 
              ? 'bg-gray-900 text-white placeholder-gray-400' 
              : 'bg-white text-gray-900 placeholder-gray-500'
          }`}
        />
      </div>

      {/* 미리보기 영역 */}
      <div className="flex flex-col h-full">
        <div className={`flex-1 p-4 overflow-y-auto prose prose-sm max-w-none ${
          isDarkMode 
            ? 'bg-gray-900 prose-invert' 
            : 'bg-white'
        }`}>
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              작성한 내용이 여기에 미리보기됩니다...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
