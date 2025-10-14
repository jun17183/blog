import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { PageType } from '@/hooks/usePageType';
import { 
  showSearchAtom, 
  showTagsAtom, 
  searchQueryAtom, 
  selectedTagsAtom,
  toggleSearchAtom,
  toggleTagsAtom,
  resetFiltersAtom
} from '../atoms/blogAtoms';

export function useNavigation() {
  const router = useRouter();
  const [showSearch] = useAtom(showSearchAtom);
  const [showTags] = useAtom(showTagsAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom);
  const [, toggleSearch] = useAtom(toggleSearchAtom);
  const [, toggleTags] = useAtom(toggleTagsAtom);
  const [, resetFilters] = useAtom(resetFiltersAtom);

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
      toggleSearch();
    });
  };

  const handleTagsClick = (currentPage: PageType, isWritingPage: boolean) => {
    handleNavigationWithConfirm(currentPage, isWritingPage, () => {
      toggleTags();
    });
  };

  const handleResetFilters = () => {
    resetFilters();
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
    resetFilters: handleResetFilters,
  };
}
