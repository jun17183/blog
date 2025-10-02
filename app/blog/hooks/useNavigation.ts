import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageType } from './usePageType';

export function useNavigation() {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const checkUnsavedChanges = () => false; // 임시

  const handleNavigationWithConfirm = (
    currentPage: PageType,
    isWritingPage: boolean,
    callback: () => void
  ) => {
    if (currentPage !== 'list') {
      if (isWritingPage && checkUnsavedChanges()) {
        const confirmed = confirm('작성 중인 내용이 있습니다. 목록으로 이동하시겠습니까?');
        if (!confirmed) return;
      }
      router.push('/blog');
      setTimeout(callback, 100);
    } else {
      callback();
    }
  };

  const handleSearchClick = (currentPage: PageType, isWritingPage: boolean) => {
    handleNavigationWithConfirm(currentPage, isWritingPage, () => {
      setShowSearch(!showSearch);
      if (showTags) setShowTags(false);
    });
  };

  const handleTagsClick = (currentPage: PageType, isWritingPage: boolean) => {
    handleNavigationWithConfirm(currentPage, isWritingPage, () => {
      setShowTags(!showTags);
      if (showSearch) setShowSearch(false);
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  return {
    showSearch,
    showTags,
    searchQuery,
    selectedTags,
    setSearchQuery,
    setSelectedTags,
    handleSearchClick,
    handleTagsClick,
    resetFilters,
  };
}

