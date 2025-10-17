'use client'
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useContext } from 'react';
import { MarkdownEditorContext } from './MarkdownEditor';

interface EditorFooterProps {
  isEdit?: boolean;
  postId?: string;
  onPublish?: (content: string) => void;
  onCancel?: () => void;
  onExit?: () => void;
  saving?: boolean;
}

export default function EditorFooter({ 
  isEdit = false,
  postId = '',
  onPublish,
  onCancel,
  onExit,
  saving = false
}: EditorFooterProps) {
  const [isDarkMode] = useAtom(darkModeAtom);
  const router = useRouter();
  const { cleanupImages } = useImageUpload({ 
    postId, 
    isNewPost: !isEdit 
  });

  // MarkdownEditor context에서 content 가져오기
  const editorContext = useContext(MarkdownEditorContext);
  const getContent = editorContext?.getContent || (() => '');

  const handleExit = async () => {
    if (onExit) {
      onExit();
    } else {
      // 이미지 정리
      await cleanupImages();
      router.back();
    }
  };

  const handleCancel = async () => {
    // 이미지 정리
    await cleanupImages();
    onCancel?.();
  };

  const handlePublish = () => {
    onPublish?.(getContent());
  };


  return (
    <div 
      data-footer="editor"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 border-t',
        {
          'bg-gray-900 border-gray-700': isDarkMode,
          'bg-white border-gray-200': !isDarkMode,
        }
      )}
    >
      <div className="max-w-8xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* 왼쪽: 나가기 버튼 */}
          <button
            onClick={handleExit}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer',
              {
                'text-gray-300 hover:bg-gray-800': isDarkMode,
                'text-gray-700 hover:bg-gray-50': !isDarkMode,
              }
            )}
          >
            <ArrowLeft size={20} />
            <span>나가기</span>
          </button>

          {/* 오른쪽: 취소 버튼과 출간 버튼 */}
          <div className="flex items-center gap-3">
            {/* 취소 버튼 (새 글 작성 시에만 표시) */}
            {!isEdit && (
              <button
                onClick={handleCancel}
                className={cn(
                  'px-4 py-2 rounded-lg transition-colors cursor-pointer',
                  {
                    'text-gray-300 hover:bg-gray-800': isDarkMode,
                    'text-gray-700 hover:bg-gray-50': !isDarkMode,
                  }
                )}
              >
                취소
              </button>
            )}

            {/* 출간/수정 버튼 */}
            <button
              onClick={handlePublish}
              disabled={saving}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors cursor-pointer',
                {
                  'bg-blue-500 text-white hover:bg-blue-600': !saving,
                  'bg-gray-400 text-gray-200 cursor-not-allowed': saving,
                }
              )}
            >
              {saving ? '저장 중...' : (isEdit ? '수정하기' : '출간하기')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
