'use client'
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// 에디터 컴포넌트들을 정적 import로 변경 (동적 import 문제 해결)
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import EditorFooter from '@/components/editor/EditorFooter';
import TagInput from '@/components/editor/TagInput';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { cn } from '@/lib/utils';
import { generateTempPostId } from '@/lib/postId';
import { usePageLeaveWarning } from '@/hooks/usePageLeaveWarning';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function EditorPage() {
  const [isDarkMode] = useAtom(darkModeAtom);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tempPostId] = useState(() => generateTempPostId());
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();

  // 페이지 이탈 경고
  const { confirmLeave } = usePageLeaveWarning({ 
    isDirty,
    message: '작성 중인 내용이 있습니다. 정말 나가시겠습니까?'
  });


  // 변경사항 추적
  useEffect(() => {
    setIsDirty(true);
  }, [title, tags]);

  const handlePublish = useCallback(async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    // MarkdownEditor에서 직접 content 가져오기
    const editorElement = document.querySelector('[data-editor="markdown"]');
    if (!editorElement) {
      alert('에디터를 찾을 수 없습니다.');
      return;
    }

    const textarea = editorElement.querySelector('textarea');
    if (!textarea) {
      alert('텍스트 영역을 찾을 수 없습니다.');
      return;
    }

    const content = textarea.value;
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: title.trim(),
                  tags,
                  content: content.trim(),
                  postId: tempPostId,
                }),
      });

      const result = await response.json();

      if (result.success) {
        alert('게시글이 성공적으로 저장되었습니다.');
        setIsDirty(false);
        router.push('/blog');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Publish failed:', error);
      alert('게시글 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }, [title, tags, tempPostId, router]);

  const handleCancel = useCallback(() => {
    confirmLeave(() => {
      router.push('/blog');
    });
  }, [confirmLeave, router]);

  const handleExit = useCallback(() => {
    confirmLeave(() => {
      router.back();
    });
  }, [confirmLeave, router]);



  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 제목 입력 */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요."
          className={cn(
            'w-full px-0 py-2 text-2xl font-bold border-none outline-none bg-transparent',
            {
              'text-white placeholder-gray-400': isDarkMode,
              'text-gray-900 placeholder-gray-500': !isDarkMode,
            }
          )}
        />
        <TagInput
          tags={tags}
          onTagsChange={setTags}
          placeholder="태그를 입력하세요"
        />
      </div>

      {/* 마크다운 에디터 - 남은 공간을 모두 사용 */}
      <div className="flex-1 overflow-hidden">
        <MarkdownEditor 
          postId={tempPostId}
          isNewPost={true}
        >
          <MarkdownEditor.Editor />
        </MarkdownEditor>
      </div>

      {/* 하단 푸터 */}
      <EditorFooter 
        isEdit={false}
        postId={tempPostId}
        onPublish={handlePublish}
        onCancel={handleCancel}
        onExit={handleExit}
        saving={saving}
      />
    </div>
  );
}
