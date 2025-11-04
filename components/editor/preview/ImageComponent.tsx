'use client'
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { Components } from 'react-markdown';
import Image from 'next/image';

export const ImageComponent: Components['img'] = ({ src, alt, width, height, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  // 빈 src 처리
  if (!src || src === '') {
    return null;
  }
  
  // Blob 타입인 경우 처리
  if (src instanceof Blob) {
    return (
      <Image 
        src={URL.createObjectURL(src)} 
        alt={alt || ''} 
        width={800}
        height={600}
        className={`max-w-full h-auto rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}
        {...props}
      />
    );
  }
  
  // public 폴더의 이미지는 직접 접근 가능하므로 unoptimized 처리
  const isPublicImage = src.startsWith('/images/');
  
  return (
    <Image 
      src={src} 
      alt={alt || ''} 
      width={800}
      height={600}
      unoptimized={isPublicImage}
      className={`max-w-full h-auto rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}
      {...props}
    />
  );
}
