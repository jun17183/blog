'use client'
import { Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';

interface CodeButtonsProps {
  onCode: () => void;
  onCodeBlock: () => void;
}

export default function CodeButtons({ onCode, onCodeBlock }: CodeButtonsProps) {
  const [isDarkMode] = useAtom(darkModeAtom);

  const toolbarButtonClass = `p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
    isDarkMode ? 'text-gray-300' : 'text-gray-600'
  }`;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onCode}
        className={toolbarButtonClass}
        title="인라인 코드"
      >
        <Code size={16} />
      </button>
      <button
        onClick={onCodeBlock}
        className={toolbarButtonClass}
        title="코드 블록"
      >
        <Code size={16} />
      </button>
    </div>
  );
}
