'use client'
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface EditorFooterProps {
  isDarkMode: boolean;
  isEdit?: boolean;
  onPublish?: () => void;
}

export default function EditorFooter({ 
  isDarkMode, 
  isEdit = false,
  onPublish 
}: EditorFooterProps) {
  const router = useRouter();

  const handleExit = () => {
    router.back();
  };

  const handlePublish = () => {
    onPublish?.();
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 border-t ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-8xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* 왼쪽: 나가기 버튼 */}
          <button
            onClick={handleExit}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft size={20} />
            <span>나가기</span>
          </button>

          {/* 오른쪽: 출간 버튼 */}
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            {isEdit ? '수정하기' : '출간하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
