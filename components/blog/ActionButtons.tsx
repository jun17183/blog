'use client'
import { Tag, Sun, Moon } from 'lucide-react';
import { useAtom } from 'jotai';
import Button from '@/components/common/Button';
import { PageType } from '@/hooks/usePageType';
import { darkModeAtom } from '@/atoms/blogAtoms';

interface ActionButtonsProps {
  showTags: boolean;
  currentPage: PageType;
  onTagsClick: () => void;
}

export default function ActionButtons({
  showTags,
  currentPage,
  onTagsClick,
}: ActionButtonsProps) {
  const [isDarkMode, toggleDarkMode] = useAtom(darkModeAtom);
  const getButtonVariant = (isActive: boolean) => {
    if (isActive && currentPage === 'list') {
      return 'primary' as const;
    }
    return 'ghost' as const;
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={onTagsClick}
        variant={getButtonVariant(showTags)}
        title={currentPage !== 'list' ? '목록으로 이동하여 태그 선택' : '태그'}
        className="cursor-pointer"
        isDarkMode={isDarkMode}
      >
        <Tag size={20} />
      </Button>
      
      <Button
        onClick={toggleDarkMode}
        variant="ghost"
        className="cursor-pointer"
        isDarkMode={isDarkMode}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </Button>
    </div>
  );
}

