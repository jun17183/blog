'use client'
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';

interface HeadingButtonsProps {
  onHeading: (level: number) => void;
}

export default function HeadingButtons({ onHeading }: HeadingButtonsProps) {
  const [isDarkMode] = useAtom(darkModeAtom);

  const toolbarButtonClass = `p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
    isDarkMode ? 'text-gray-300' : 'text-gray-600'
  }`;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onHeading(1)}
        className={toolbarButtonClass}
        title="제목 1"
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => onHeading(2)}
        className={toolbarButtonClass}
        title="제목 2"
      >
        <Heading2 size={16} />
      </button>
      <button
        onClick={() => onHeading(3)}
        className={toolbarButtonClass}
        title="제목 3"
      >
        <Heading3 size={16} />
      </button>
      <button
        onClick={() => onHeading(4)}
        className={toolbarButtonClass}
        title="제목 4"
      >
        <Heading4 size={16} />
      </button>
    </div>
  );
}
