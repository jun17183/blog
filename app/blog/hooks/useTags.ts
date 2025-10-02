import { useAtom } from 'jotai';
import { 
  showTagsAtom, 
  selectedTagsAtom,
  toggleTagsAtom 
} from '../atoms/blogAtoms';

export function useTags() {
  const [showTags] = useAtom(showTagsAtom);
  const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom);
  const [, toggleTags] = useAtom(toggleTagsAtom);

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleToggleTags = () => {
    toggleTags();
  };

  return {
    showTags,
    selectedTags,
    handleTagsChange,
    handleToggleTags,
  };
}
