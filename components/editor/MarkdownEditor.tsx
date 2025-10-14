'use client'
import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
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
function Toolbar() {
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
function Input() {
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
function Preview() {
  const { content, previewRef, showPreview } = useMarkdownEditorContext();

  if (!showPreview) return null;

  return (
    <div className="flex flex-col h-full border-l border-gray-200 dark:border-gray-700">
      <MarkdownPreview content={content} previewRef={previewRef} />
    </div>
  );
}

// Editor 영역 (Input + Preview)
function Editor() {
  const { showPreview } = useMarkdownEditorContext();

  return (
      <div className={cn(
        'flex-1 grid mb-20',
        {
          'grid-cols-1 lg:grid-cols-2': showPreview,
          'grid-cols-1': !showPreview,
        }
      )}>
        {/* 마크다운 입력 영역 */}
        <div className="flex flex-col h-full">
        <Toolbar />
        <Input />
        </div>

        {/* 미리보기 영역 */}
      <Preview />
    </div>
  );
}

// Compound Component 패턴으로 내보내기
MarkdownEditor.Toolbar = Toolbar;
MarkdownEditor.Input = Input;
MarkdownEditor.Preview = Preview;
MarkdownEditor.Editor = Editor;

export default MarkdownEditor;
