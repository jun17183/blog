'use client'
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { Components } from 'react-markdown';
import Image from 'next/image';

export const ImageComponent: Components['img'] = ({ src, alt, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  // 빈 src 처리
  if (!src || src === '') {
    return null;
  }
  
  // 로컬 API 이미지인 경우 unoptimized 처리
  const isLocalImage = src.startsWith('/api/images/');
  
  return (
    <Image 
      src={src} 
      alt={alt || ''} 
      width={800}
      height={600}
      unoptimized={isLocalImage}
      className={`max-w-full h-auto rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}
      {...props}
    />
  );
}
