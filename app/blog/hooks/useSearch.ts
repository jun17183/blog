import { useAtom } from 'jotai';
import { 
  showSearchAtom, 
  searchQueryAtom,
  toggleSearchAtom 
} from '../atoms/blogAtoms';

export function useSearch() {
  const [showSearch] = useAtom(showSearchAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [, toggleSearch] = useAtom(toggleSearchAtom);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleToggleSearch = () => {
    toggleSearch();
  };

  return {
    showSearch,
    searchQuery,
    handleSearchChange,
    handleToggleSearch,
  };
}
