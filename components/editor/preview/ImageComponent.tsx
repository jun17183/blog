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
  
  // width와 height를 숫자로 변환 (props에서 받은 값이 string일 수 있음)
  const imageWidth = typeof width === 'string' ? parseInt(width, 10) : (width || 800);
  const imageHeight = typeof height === 'string' ? parseInt(height, 10) : (height || 600);
  
  // Blob 타입인 경우 처리
  if (src instanceof Blob) {
    return (
      <Image 
        src={URL.createObjectURL(src)} 
        alt={alt || ''} 
        width={imageWidth}
        height={imageHeight}
        className={`max-w-full h-auto rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}
        {...props}
      />
    );
  }
  
  // Vercel Blob Storage URL 또는 API를 통해 서빙되는 이미지는 unoptimized 처리
  const isBlobUrl = src.startsWith('https://') && src.includes('blob.vercel-storage.com');
  const isPublicImage = src.startsWith('/api/images/') || src.startsWith('/images/');
  
  return (
    <Image 
      src={src} 
      alt={alt || ''} 
      width={imageWidth}
      height={imageHeight}
      unoptimized={isPublicImage || isBlobUrl}
      className={`max-w-full h-auto rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}
      {...props}
    />
  );
}
