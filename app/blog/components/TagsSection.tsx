
interface TagsSectionProps {
  isDarkMode: boolean;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const AVAILABLE_TAGS = ['React', 'TypeScript', 'Next.js', 'JavaScript', 'CSS', 'Node.js'];

export default function TagsSection({
  isDarkMode,
  selectedTags,
  onTagsChange,
}: TagsSectionProps) {
  const handleTagClick = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    if (isSelected) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className={`mt-8 p-6 rounded-lg transition-all duration-300 ${
      isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
    }`}>
      <div className="flex flex-wrap gap-3">
        {AVAILABLE_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={(e) => {
                e.currentTarget.blur(); // focus 제거
                handleTagClick(tag);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-0 ${
                isSelected
                  ? isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}

