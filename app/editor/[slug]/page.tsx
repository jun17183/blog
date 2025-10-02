'use client'
import { useState, use } from 'react';
import MarkdownEditor from '../components/MarkdownEditor';
import EditorFooter from '../components/EditorFooter';
import TagInput from '../components/TagInput';
import { useDarkMode } from '../../blog/components/DarkModeProvider';

export default function EditorEditPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { isDarkMode } = useDarkMode();
  const [title, setTitle] = useState('Next.js로 블로그 만들기');
  const [tags, setTags] = useState<string[]>(['Next.js', 'React', 'TypeScript']);
  const { slug } = use(params);

  const handlePublish = () => {
    console.log('수정 완료:', { title, tags, slug });
    // 수정 완료 로직 구현
  };

  return (
    <div className="h-full flex flex-col">
      {/* 제목 입력 */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <MarkdownEditor 
          initialContent="# 기존 내용\n\n기존 글의 내용이 여기에 로드됩니다..."
          isDarkMode={isDarkMode}
        />
      </div>

      {/* 하단 푸터 */}
      <EditorFooter 
        isDarkMode={isDarkMode}
        isEdit={true}
        onPublish={handlePublish}
      />
    </div>
  );
}
