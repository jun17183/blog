import Input from './ui/Input';
import Button from './ui/Button';

interface SearchSectionProps {
  isDarkMode: boolean;
  searchQuery: string;
  selectedTags: string[];
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
}

export default function SearchSection({
  isDarkMode,
  searchQuery,
  selectedTags,
  onSearchChange,
  onResetFilters,
}: SearchSectionProps) {
  return (
    <div className={`mt-8 p-6 rounded-lg transition-all duration-300 ${
      isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
    }`}>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="검색어를 입력하세요..."
            isDarkMode={isDarkMode}
          />
        </div>
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          12 posts
        </span>
        {(searchQuery || selectedTags.length > 0) && (
          <Button
            onClick={onResetFilters}
            variant="ghost"
            size="sm"
            isDarkMode={isDarkMode}
            className="px-3 py-2 text-sm"
          >
            초기화
          </Button>
        )}
      </div>
    </div>
  );
}

