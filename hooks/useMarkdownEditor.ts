import { useState, useRef, useEffect, useCallback } from 'react';

interface UseMarkdownEditorProps {
  initialContent?: string;
}

export function useMarkdownEditor({ initialContent = '' }: UseMarkdownEditorProps = {}) {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // 스크롤 동기화 함수
  const syncScroll = useCallback(() => {
    if (textareaRef.current && previewRef.current) {
      const textarea = textareaRef.current;
      const preview = previewRef.current;
      
      // textarea의 최대 스크롤 위치를 제한 (하단 패딩 고려)
      const textareaMaxScroll = textarea.scrollHeight - textarea.clientHeight - 152; // 80px 여백
      const textareaScrollRatio = Math.min(textarea.scrollTop, textareaMaxScroll) / textareaMaxScroll;
      
      // 미리보기 영역의 스크롤 위치 계산
      const previewMaxScroll = preview.scrollHeight - preview.clientHeight;
      const targetScroll = textareaScrollRatio * previewMaxScroll;
      
      preview.scrollTop = targetScroll;
    }
  }, []);

  // content가 변경될 때 스크롤 동기화
  useEffect(() => {
    // 렌더링 완료 후 스크롤 동기화
    const timer = setTimeout(() => {
      if (textareaRef.current && previewRef.current) {
        const textarea = textareaRef.current;
        const preview = previewRef.current;
        
        // textarea의 현재 스크롤 위치를 미리보기에 직접 적용
        preview.scrollTop = textarea.scrollTop;
      }
    }, 50); // 지연 시간을 늘려서 렌더링 완료 보장
    
    return () => clearTimeout(timer);
  }, [content]);

  // 텍스트 삽입 함수
  const insertText = useCallback((text: string, cursorOffset: number = 0) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    // 선택된 텍스트가 있으면 해당 텍스트를 사용
    const insertTextValue = selectedText ? text.replace('텍스트', selectedText) : text;
    
    const newContent = content.substring(0, start) + insertTextValue + content.substring(end);
    setContent(newContent);
    
    // 커서 위치 설정
    setTimeout(() => {
      const newCursorPos = start + insertTextValue.length - cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  }, [content]);

  // 이미지 업로드 처리
  const handleImageUpload = useCallback((file: File) => {
    // 실제 구현에서는 이미지를 서버에 업로드하고 URL을 받아와야 함
    const imageUrl = URL.createObjectURL(file);
    const imageMarkdown = `![${file.name}](${imageUrl})`;
    insertText(imageMarkdown, 0);
  }, [insertText]);

  // 키보드 단축키 처리
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertText('**텍스트**', 2);
          break;
        case 'i':
          e.preventDefault();
          insertText('*텍스트*', 1);
          break;
        case 'k':
          e.preventDefault();
          insertText('[링크 텍스트](URL)', 1);
          break;
        case '`':
          e.preventDefault();
          insertText('`코드`', 1);
          break;
      }
    }
  }, [insertText]);

  return {
    content,
    setContent,
    textareaRef,
    previewRef,
    syncScroll,
    insertText,
    handleImageUpload,
    handleKeyDown,
  };
}
