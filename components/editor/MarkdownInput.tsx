'use client'
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';

interface MarkdownInputProps {
  content: string;
  onChange: (content: string) => void;
  onScroll: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export default function MarkdownInput({ 
  content, 
  onChange, 
  onScroll, 
  onKeyDown, 
  textareaRef 
}: MarkdownInputProps) {
  const [isDarkMode] = useAtom(darkModeAtom);

  return (
    <div className="h-full relative" data-editor="markdown">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        placeholder="당신의 이야기를 적어보세요..."
        className={`w-full h-full px-6 py-4 border-none resize-none focus:outline-none font-mono text-sm leading-relaxed ${
          isDarkMode 
            ? 'bg-gray-900 text-white placeholder-gray-400' 
            : 'bg-white text-gray-900 placeholder-gray-500'
        }`}
        style={{
          scrollPaddingBottom: '80px'
        }}
      />
    </div>
  );
}
