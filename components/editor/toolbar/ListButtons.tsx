'use client'
import { 
  List, 
  ListOrdered,
  Quote 
} from 'lucide-react';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';

interface ListButtonsProps {
  onList: () => void;
  onOrderedList: () => void;
  onQuote: () => void;
}

export default function ListButtons({ 
  onList, 
  onOrderedList, 
  onQuote 
}: ListButtonsProps) {
  const [isDarkMode] = useAtom(darkModeAtom);

  const toolbarButtonClass = `p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
    isDarkMode ? 'text-gray-300' : 'text-gray-600'
  }`;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onList}
        className={toolbarButtonClass}
        title="순서 없는 목록"
      >
        <List size={16} />
      </button>
      <button
        onClick={onOrderedList}
        className={toolbarButtonClass}
        title="순서 있는 목록"
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={onQuote}
        className={toolbarButtonClass}
        title="인용문"
      >
        <Quote size={16} />
      </button>
    </div>
  );
}
