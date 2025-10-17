
import { cn } from '@/lib/utils';

interface TagWithCount {
  tag: string;
  count: number;
}

interface TagsSectionProps {
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  isDarkMode: boolean;
  availableTags: TagWithCount[];
}

/**
 * 태그 섹션 컴포넌트
 * - 클릭 가능한 태그 목록 표시
 * - 태그별 게시글 개수 표시
 * - 긴 태그명 자동 축약 처리
 */
export default function TagsSection({
  selectedTag,
  onTagChange,
  isDarkMode,
  availableTags,
}: TagsSectionProps) {
  // 태그 클릭 핸들러 (토글 방식)
  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      onTagChange(null); // 선택 해제
    } else {
      onTagChange(tag); // 새 태그 선택
    }
  };

  return (
    <div className={cn(
      'mt-8 p-6 rounded-lg transition-all duration-300',
      'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]',
      {
        'bg-gray-800 border border-gray-700': isDarkMode,
        'bg-gray-50 border border-gray-200': !isDarkMode,
      }
    )}>
      <div className="flex flex-wrap gap-3">
        {availableTags.map(({ tag, count }) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={(e) => {
                e.currentTarget.blur(); // focus 제거
                handleTagClick(tag);
              }}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-0',
                {
                  // Selected state
                  'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600': 
                    isSelected && isDarkMode,
                  'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300': 
                    isSelected && !isDarkMode,
                  // Unselected state
                  'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600': 
                    !isSelected && isDarkMode,
                  'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300': 
                    !isSelected && !isDarkMode,
                }
              )}
            >
              {(() => {
                // 긴 태그명 축약 처리 (20자 초과 시 ... 표시)
                const displayTag = tag.length > 20 ? tag.substring(0, 20) + '...' : tag;
                return `#${displayTag} (${count})`;
              })()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

