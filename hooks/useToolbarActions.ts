import { useCallback } from 'react';

interface UseToolbarActionsProps {
  onInsert: (text: string, cursorOffset?: number) => void;
  postId?: string;
  onImageAdded?: (fileName: string) => void;
}

export function useToolbarActions({ onInsert, postId, onImageAdded }: UseToolbarActionsProps) {
  const handleHeading = useCallback((level: number) => {
    const headingText = '#'.repeat(level) + ' ';
    onInsert(headingText, 0);
  }, [onInsert]);

  const handleBold = useCallback(() => {
    onInsert('**텍스트**', 2);
  }, [onInsert]);

  const handleItalic = useCallback(() => {
    onInsert('*텍스트*', 1);
  }, [onInsert]);

  const handleStrikethrough = useCallback(() => {
    onInsert('~~텍스트~~', 2);
  }, [onInsert]);

  const handleQuote = useCallback(() => {
    onInsert('> ');
  }, [onInsert]);

  const handleLink = useCallback(() => {
    onInsert('[링크 텍스트](URL)', 1);
  }, [onInsert]);

  const handleCode = useCallback(() => {
    onInsert('`코드`', 1);
  }, [onInsert]);

  const handleCodeBlock = useCallback(() => {
    onInsert('```\n코드 블록\n```', 4);
  }, [onInsert]);

  const handleList = useCallback(() => {
    onInsert('- ');
  }, [onInsert]);

  const handleOrderedList = useCallback(() => {
    onInsert('1. ');
  }, [onInsert]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !postId) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('postId', postId);
      formData.append('isTemp', 'false');

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onInsert(result.markdownImage, 0);
        onImageAdded?.(result.fileName);
      } else {
        alert('이미지 업로드에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('이미지 업로드에 실패했습니다.');
    }

    // 파일 입력 초기화
    event.target.value = '';
  }, [onInsert, postId, onImageAdded]);

  return {
    handleHeading,
    handleBold,
    handleItalic,
    handleStrikethrough,
    handleQuote,
    handleLink,
    handleCode,
    handleCodeBlock,
    handleList,
    handleOrderedList,
    handleImageUpload,
  };
}
