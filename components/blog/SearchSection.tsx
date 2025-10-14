import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';

interface SearchSectionProps {
  searchQuery: string;
  selectedTags: string[];
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
  isDarkMode: boolean;
}

export default function SearchSection({
  searchQuery,
  selectedTags,
  onSearchChange,
  onResetFilters,
  isDarkMode,
}: SearchSectionProps) {
  return (
    <div className={cn(
      'mt-8 p-6 rounded-lg transition-all duration-300',
      {
        'bg-gray-800 border border-gray-700': isDarkMode,
        'bg-gray-50 border border-gray-200': !isDarkMode,
      }
    )}>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="검색어를 입력하세요."
            isDarkMode={isDarkMode}
          />
        </div>
        <span className={cn(
          'text-sm',
          {
            'text-gray-400': isDarkMode,
            'text-gray-500': !isDarkMode,
          }
        )}>
          12 posts
        </span>
        {(searchQuery || selectedTags.length > 0) && (
          <Button
            onClick={onResetFilters}
            variant="ghost"
            size="sm"
            className="px-3 py-2 text-sm"
            isDarkMode={isDarkMode}
          >
            초기화
          </Button>
        )}
      </div>
    </div>
  );
}

