'use client'
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { Components } from 'react-markdown';

export const ImageComponent: Components['img'] = ({ src, alt, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  // 빈 src 처리
  if (!src || src === '') {
    return null;
  }
  
  return (
    <img 
      src={src} 
      alt={alt || ''} 
      className={`max-w-full h-auto rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}
      {...props}
    />
  );
}
