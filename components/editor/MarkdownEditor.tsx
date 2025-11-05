'use client'
import { useState, createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import { useImageUpload } from '@/hooks/useImageUpload';
import { generateTempPostId } from '@/lib/postId';
import MarkdownToolbar from './MarkdownToolbar';
import MarkdownInput from './MarkdownInput';
import MarkdownPreview from './MarkdownPreview';

interface MarkdownEditorContextType {
  content: string;
  setContent: (content: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  previewRef: React.RefObject<HTMLDivElement | null>;
  syncScroll: () => void;
  insertText: (text: string, cursorOffset?: number) => void;
  handleImageUpload: (file: File) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  postId: string;
  isNewPost: boolean;
  getContent: () => string;
  onImageAdded: (fileName: string) => void;
}

export const MarkdownEditorContext = createContext<MarkdownEditorContextType | null>(null);

const useMarkdownEditorContext = () => {
  const context = useContext(MarkdownEditorContext);
  if (!context) {
    throw new Error('useMarkdownEditorContext must be used within MarkdownEditor');
  }
  return context;
};

interface MarkdownEditorProps {
  initialContent?: string;
  postId?: string;
  isNewPost?: boolean;
  children: ReactNode;
}

function MarkdownEditor({ 
  initialContent = '', 
  postId: providedPostId,
  isNewPost = true,
  children 
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [postId] = useState(() => providedPostId || generateTempPostId());
  
  const editorState = useMarkdownEditor({ initialContent });
  const { addNewImage } = useImageUpload({ postId, isNewPost });

  const contextValue: MarkdownEditorContextType = {
    ...editorState,
    showPreview,
    setShowPreview,
    postId,
    isNewPost,
    getContent: () => editorState.content,
    onImageAdded: addNewImage,
  };

  return (
    <MarkdownEditorContext.Provider value={contextValue}>
      <div className="h-full flex flex-col">
        {children}
      </div>
    </MarkdownEditorContext.Provider>
  );
}

// Toolbar 컴포넌트
export function Toolbar() {
  const { insertText, postId, onImageAdded } = useMarkdownEditorContext();
  
  return (
    <MarkdownToolbar 
      onInsert={insertText}
      postId={postId}
      onImageAdded={onImageAdded}
    />
  );
}

// Input 컴포넌트
export function Input() {
  const { 
    content, 
    setContent, 
    syncScroll, 
    handleKeyDown, 
    textareaRef 
  } = useMarkdownEditorContext();

  return (
    <MarkdownInput
      content={content}
      onChange={setContent}
      onScroll={syncScroll}
      onKeyDown={handleKeyDown}
      textareaRef={textareaRef}
    />
  );
}

// Preview 컴포넌트
export function Preview() {
  const { content, previewRef, showPreview, setContent } = useMarkdownEditorContext();

  if (!showPreview) return null;

  // 이미지 리사이즈 핸들러
  const handleImageResize = (src: string, width: number) => {
    // 마크다운 콘텐츠에서 해당 이미지를 찾아 업데이트
    const escapedSrc = src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // HTML img 태그 패턴 (자가 닫는 태그와 일반 태그 모두 처리)
    const htmlImgRegex = new RegExp(`<img([^>]*?)\\s*src=["']${escapedSrc}["']([^>]*?)\\s*/?>`, 'gi');
    
    // 마크다운 이미지 패턴
    const markdownImgRegex = new RegExp(`!\\[(.*?)\\]\\(${escapedSrc}\\)`, 'gi');
    
    let updatedContent = content;
    
    // HTML img 태그 업데이트
    updatedContent = updatedContent.replace(htmlImgRegex, (match, before, after) => {
      const attributes = before + after;
      
      // alt 속성 추출 (있다면)
      const altMatch = attributes.match(/alt=["']([^"']*)["']/i);
      const altText = altMatch ? altMatch[1] : '';
      
      // 새로운 img 태그 생성 (깔끔하게)
      return `<img src="${src}" alt="${altText}" style="width: ${width}px; height: auto; max-width: 100%;" />`;
    });
    
    // 마크다운 형식인 경우 HTML로 변환 (inline style 사용)
    updatedContent = updatedContent.replace(markdownImgRegex, (match, alt) => {
      return `<img src="${src}" alt="${alt || ''}" style="width: ${width}px; height: auto; max-width: 100%;" />`;
    });
    
    setContent(updatedContent);
  };

  return (
    <div className="flex flex-col h-full border-l border-gray-200 dark:border-gray-700">
      <MarkdownPreview 
        content={content} 
        previewRef={previewRef} 
        isEditable={true}
        onImageResize={handleImageResize}
      />
    </div>
  );
}

// Editor 영역 (Input + Preview)
export function Editor() {
  const { showPreview } = useMarkdownEditorContext();

  return (
    <div className={cn(
      'grid h-full',
      {
        'grid-cols-1 lg:grid-cols-2': showPreview,
        'grid-cols-1': !showPreview,
      }
    )}>
      {/* 마크다운 입력 영역 */}
      <div className="flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <Toolbar />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Input />
        </div>
      </div>

      {/* 미리보기 영역 */}
      <div className="overflow-y-auto">
        <Preview />
      </div>
    </div>
  );
}

// Compound Component 패턴으로 내보내기
MarkdownEditor.Toolbar = Toolbar;
MarkdownEditor.Input = Input;
MarkdownEditor.Preview = Preview;
MarkdownEditor.Editor = Editor;

export default MarkdownEditor;
