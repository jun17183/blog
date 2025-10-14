import { useState, useCallback } from 'react';

interface UseImageUploadProps {
  postId: string;
  isNewPost: boolean;
}

export function useImageUpload({ postId, isNewPost }: UseImageUploadProps) {
  const [newImageNames, setNewImageNames] = useState<string[]>([]);

  const addNewImage = useCallback((fileName: string) => {
    setNewImageNames(prev => [...prev, fileName]);
  }, []);

  const removeNewImage = useCallback((fileName: string) => {
    setNewImageNames(prev => prev.filter(name => name !== fileName));
  }, []);

  const cleanupImages = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/images/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId, 
          isNewPost,
          imageNames: isNewPost ? [] : newImageNames // 새 글 작성 시에는 빈 배열, 수정 시에는 새로 추가된 이미지들
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNewImageNames([]);
        return true;
      } else {
        throw new Error(result.error || 'Cleanup failed');
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
      return false;
    }
  }, [postId, isNewPost, newImageNames]);

  return {
    addNewImage,
    removeNewImage,
    cleanupImages,
    newImageNames,
  };
}
