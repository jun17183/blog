'use client'
import { 
  Link, 
  Image 
} from 'lucide-react';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';

interface MediaButtonsProps {
  onLink: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MediaButtons({ onLink, onImageUpload }: MediaButtonsProps) {
  const [isDarkMode] = useAtom(darkModeAtom);

  const toolbarButtonClass = `p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
    isDarkMode ? 'text-gray-300' : 'text-gray-600'
  }`;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onLink}
        className={toolbarButtonClass}
        title="링크 (Ctrl+K)"
      >
        <Link size={16} />
      </button>
      <label className={toolbarButtonClass} title="이미지 업로드" aria-label="이미지 업로드">
        <Image size={16} alt="이미지 업로드" />
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
      </label>
    </div>
  );
}
