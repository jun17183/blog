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

export const ImageComponent: Components['img'] = ({ src, alt, width, height, style, ...props }) => {
  // React Hooks는 항상 최상단에서 호출
  const [isDarkMode] = useAtom(darkModeAtom);
  
  const isEditable = (props as ImageComponentProps).isEditable || false;
  const onImageResize = (props as ImageComponentProps).onImageResize;
  
  // style 속성에서 width 추출 (리사이즈된 경우)
  let imageWidth = typeof width === 'string' ? parseInt(width, 10) : (width || 800);
  let imageHeight = typeof height === 'string' ? parseInt(height, 10) : (height || 600);
  
  // style.width가 있으면 우선 사용 (리사이즈된 경우)
  if (style && typeof style === 'object') {
    const styleObj = style as React.CSSProperties;
    if (styleObj.width) {
      const widthStr = String(styleObj.width);
      const parsedWidth = parseInt(widthStr, 10);
      if (!isNaN(parsedWidth)) {
        imageWidth = parsedWidth;
      }
    }
  }
  
  // 빈 src 처리
  if (!src || src === '') {
    return null;
  }
  
  // Blob 타입인 경우 처리 (일반 Image로 렌더링)
  if (src instanceof Blob) {
    return (
      <div className="flex justify-center my-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={URL.createObjectURL(src)}
          alt={alt || ''}
          style={{ 
            width: width ? `${imageWidth}px` : 'auto',
            height: 'auto',
            maxWidth: '100%'
          }}
          className={`rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        />
      </div>
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
  return (
    <div className="flex justify-center my-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ''}
        style={{ 
          width: width ? `${imageWidth}px` : 'auto',
          height: 'auto',
          maxWidth: '100%'
        }}
        className={`rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}
      />
    </div>
  );
}
