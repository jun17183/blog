'use client'
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { useToolbarActions } from '@/hooks/useToolbarActions';
import HeadingButtons from './toolbar/HeadingButtons';
import TextStyleButtons from './toolbar/TextStyleButtons';
import MediaButtons from './toolbar/MediaButtons';
import CodeButtons from './toolbar/CodeButtons';
import ListButtons from './toolbar/ListButtons';
import ToolbarSeparator from './toolbar/ToolbarSeparator';

interface MarkdownToolbarProps {
  onInsert: (text: string, cursorOffset?: number) => void;
  postId?: string;
  onImageAdded?: (fileName: string) => void;
}

export default function MarkdownToolbar({ 
  onInsert, 
  postId,
  onImageAdded
}: MarkdownToolbarProps) {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  const {
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
  } = useToolbarActions({ onInsert, postId, onImageAdded });

  return (
    <div className={cn(
      'flex items-center gap-1 p-2 border-b',
      {
        'border-gray-700 bg-gray-800': isDarkMode,
        'border-gray-200 bg-gray-50': !isDarkMode,
      }
    )}>
      {/* 헤딩 버튼들 */}
      <HeadingButtons onHeading={handleHeading} />
      
      <ToolbarSeparator />

      {/* 텍스트 스타일 버튼들 */}
      <TextStyleButtons 
        onBold={handleBold}
        onItalic={handleItalic}
        onStrikethrough={handleStrikethrough}
      />

      <ToolbarSeparator />

      {/* 링크 및 미디어 버튼들 */}
      <MediaButtons 
        onLink={handleLink}
        onImageUpload={handleImageUpload}
      />

      <ToolbarSeparator />

      {/* 코드 버튼들 */}
      <CodeButtons 
        onCode={handleCode}
        onCodeBlock={handleCodeBlock}
      />

      <ToolbarSeparator />

      {/* 리스트 버튼들 */}
      <ListButtons 
        onList={handleList}
        onOrderedList={handleOrderedList}
        onQuote={handleQuote}
      />
    </div>
  );
}
