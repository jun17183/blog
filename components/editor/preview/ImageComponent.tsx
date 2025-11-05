'use client'
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { Components } from 'react-markdown';
import ResizableImage from './ResizableImage';

interface ImageComponentProps {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  isEditable?: boolean;
  onImageResize?: (src: string, width: number) => void;
}

export const ImageComponent: Components['img'] = ({ src, alt, width, height, ...props }) => {
  const isEditable = (props as ImageComponentProps).isEditable || false;
  const onImageResize = (props as ImageComponentProps).onImageResize;
  
  // 빈 src 처리
  if (!src || src === '') {
    return null;
  }
  
  // Blob 타입인 경우 처리 (일반 Image로 렌더링)
  if (src instanceof Blob) {
    const [isDarkMode] = useAtom(darkModeAtom);
    const imageWidth = typeof width === 'string' ? parseInt(width, 10) : (width || 800);
    const imageHeight = typeof height === 'string' ? parseInt(height, 10) : (height || 600);
    
    return (
      <img
        src={URL.createObjectURL(src)}
        alt={alt || ''}
        width={imageWidth}
        height={imageHeight}
        className={`max-w-full h-auto rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    );
  }
  
  // 에디터 모드이고 onImageResize가 제공된 경우 리사이저블 이미지 사용
  if (isEditable && onImageResize) {
    return (
      <ResizableImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        isEditable={true}
        onResize={(newWidth) => {
          if (onImageResize) {
            onImageResize(src, newWidth);
          }
        }}
      />
    );
  }
  
  // 일반 모드 (블로그 페이지 등)
  const [isDarkMode] = useAtom(darkModeAtom);
  const imageWidth = typeof width === 'string' ? parseInt(width, 10) : (width || 800);
  const imageHeight = typeof height === 'string' ? parseInt(height, 10) : (height || 600);
  
  // Vercel Blob Storage URL 또는 API를 통해 서빙되는 이미지는 unoptimized 처리
  const isBlobUrl = src.startsWith('https://') && src.includes('blob.vercel-storage.com');
  const isPublicImage = src.startsWith('/api/images/') || src.startsWith('/images/');
  
  return (
    <img
      src={src}
      alt={alt || ''}
      width={imageWidth}
      height={imageHeight}
      className={`max-w-full h-auto rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}
