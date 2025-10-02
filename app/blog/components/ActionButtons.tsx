import { Search, Tag, Sun, Moon } from 'lucide-react';
import Button from './ui/Button';
import { PageType } from '../hooks/usePageType';

interface ActionButtonsProps {
  isDarkMode: boolean;
  showSearch: boolean;
  showTags: boolean;
  currentPage: PageType;
  onSearchClick: () => void;
  onTagsClick: () => void;
  onDarkModeToggle: () => void;
}

export default function ActionButtons({
  isDarkMode,
  showSearch,
  showTags,
  currentPage,
  onSearchClick,
  onTagsClick,
  onDarkModeToggle,
}: ActionButtonsProps) {
  const getButtonVariant = (isActive: boolean) => {
    if (isActive && currentPage === 'list') {
      return 'primary' as const;
    }
    return 'ghost' as const;
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={onSearchClick}
        variant={getButtonVariant(showSearch)}
        isDarkMode={isDarkMode}
        title={currentPage !== 'list' ? '목록으로 이동하여 검색' : '검색'}
        className="cursor-pointer"
      >
        <Search size={20} />
      </Button>
      
      <Button
        onClick={onTagsClick}
        variant={getButtonVariant(showTags)}
        isDarkMode={isDarkMode}
        title={currentPage !== 'list' ? '목록으로 이동하여 태그 선택' : '태그'}
        className="cursor-pointer"
      >
        <Tag size={20} />
      </Button>
      
      <Button
        onClick={onDarkModeToggle}
        variant="ghost"
        isDarkMode={isDarkMode}
        className="cursor-pointer"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </Button>
    </div>
  );
}

