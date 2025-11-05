'use client'
import { useState, useRef, useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';

interface ResizableImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  onResize?: (width: number) => void;
  isEditable?: boolean;
}

export default function ResizableImage({ 
  src, 
  alt = '', 
  width: initialWidth, 
  height: initialHeight,
  onResize,
  isEditable = false 
}: ResizableImageProps) {
  const [isDarkMode] = useAtom(darkModeAtom);
  const [width, setWidth] = useState<number>(() => {
    if (typeof initialWidth === 'string') {
      return parseInt(initialWidth, 10) || 800;
    }
    return initialWidth || 800;
  });
  const [aspectRatio, setAspectRatio] = useState<number>(() => {
    const w = typeof initialWidth === 'string' ? parseInt(initialWidth, 10) : (initialWidth || 800);
    const h = typeof initialHeight === 'string' ? parseInt(initialHeight, 10) : (initialHeight || 600);
    return w / h;
  });
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // initialWidth prop이 변경될 때 내부 상태 동기화
  useEffect(() => {
    if (!isResizing) { // 리사이징 중이 아닐 때만 업데이트
      const newWidth = typeof initialWidth === 'string' 
        ? parseInt(initialWidth, 10) || 800 
        : (initialWidth || 800);
      setWidth(newWidth);
    }
  }, [initialWidth, isResizing]);

  // 이미지 로드 시 원본 비율 계산
  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      const handleLoad = () => {
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        if (naturalWidth > 0 && naturalHeight > 0) {
          const ratio = naturalWidth / naturalHeight;
          setAspectRatio(ratio);
          // 초기 width만 있고 height가 없으면 비율에 맞게 계산
          if (initialWidth && !initialHeight) {
            const w = typeof initialWidth === 'string' ? parseInt(initialWidth, 10) : initialWidth;
            setWidth(w);
          }
        }
      };
      
      if (img.complete && img.naturalWidth > 0) {
        handleLoad();
      } else {
        img.addEventListener('load', handleLoad);
        return () => img.removeEventListener('load', handleLoad);
      }
    }
  }, [src, initialWidth, initialHeight]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isEditable) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startXRef.current;
      const newWidth = Math.max(200, Math.min(2000, startWidthRef.current + deltaX));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      if (onResize && containerRef.current) {
        const finalWidth = containerRef.current.offsetWidth;
        onResize(finalWidth);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isEditable, width, onResize]);

  const displayHeight = Math.round(width / aspectRatio);

  return (
    <div className="flex justify-center my-4">
      <div
        ref={containerRef}
        className="relative"
        style={{ width: `${width}px`, maxWidth: '100%' }}
        onMouseEnter={() => isEditable && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className={`rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          } ${isEditable && isHovered ? 'ring-2 ring-blue-500' : ''}`}
          style={{ 
            width: '100%', 
            height: 'auto',
            userSelect: 'none',
            pointerEvents: isResizing ? 'none' : 'auto',
            display: 'block'
          }}
        />
      {isEditable && (isHovered || isResizing) && (
        <div
          className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-tl-lg cursor-nwse-resize flex items-center justify-center hover:bg-blue-600 transition-colors"
          style={{ 
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 10
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="w-3 h-3 bg-white rounded-sm"></div>
        </div>
      )}
      {isEditable && isHovered && (
        <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-black/70 text-white rounded pointer-events-none">
          {width} × {displayHeight}
        </div>
      )}
      </div>
    </div>
  );
}

