'use client'
import { 
  Bold, 
  Italic, 
  Strikethrough 
} from 'lucide-react';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';

interface TextStyleButtonsProps {
  onBold: () => void;
  onItalic: () => void;
  onStrikethrough: () => void;
}

export default function TextStyleButtons({ 
  onBold, 
  onItalic, 
  onStrikethrough 
}: TextStyleButtonsProps) {
  const [isDarkMode] = useAtom(darkModeAtom);

  const toolbarButtonClass = `p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
    isDarkMode ? 'text-gray-300' : 'text-gray-600'
  }`;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onBold}
        className={toolbarButtonClass}
        title="굵게 (Ctrl+B)"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={onItalic}
        className={toolbarButtonClass}
        title="기울임 (Ctrl+I)"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={onStrikethrough}
        className={toolbarButtonClass}
        title="취소선"
      >
        <Strikethrough size={16} />
      </button>
    </div>
  );
}
