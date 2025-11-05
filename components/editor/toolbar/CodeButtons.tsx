'use client'
import { Code } from 'lucide-react';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';

interface CodeButtonsProps {
  onCodeBlock: () => void;
}

export default function CodeButtons({ onCodeBlock }: CodeButtonsProps) {
  const [isDarkMode] = useAtom(darkModeAtom);

  const toolbarButtonClass = `p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
    isDarkMode ? 'text-gray-300' : 'text-gray-600'
  }`;

  return (
    <button
      onClick={onCodeBlock}
      className={toolbarButtonClass}
      title="코드 블록"
    >
      <Code size={16} />
    </button>
  );
}
