'use client'
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import EditorFooter from '@/components/editor/EditorFooter';
import TagInput from '@/components/editor/TagInput';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { cn } from '@/lib/utils';
import { usePageLeaveWarning } from '@/hooks/usePageLeaveWarning';

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  excerpt: string;
  date: string;
  updated?: string;
}

export default function EditPostPage() {
  const [isDarkMode] = useAtom(darkModeAtom);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  // 페이지 이탈 경고
  const { confirmLeave } = usePageLeaveWarning({ 
    isDirty,
    message: '수정 중인 내용이 있습니다. 정말 나가시겠습니까?'
  });

  // 게시글 데이터 로드
  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        const result = await response.json();

        if (result.success) {
          const post: Post = result.post;
          setTitle(post.title);
          setTags(post.tags || []);
          setContent(post.content);
          setExcerpt(post.excerpt || '');
        } else {
          alert('게시글을 불러올 수 없습니다.');
          router.push('/blog');
        }
      } catch (error) {
        console.error('Failed to load post:', error);
        alert('게시글을 불러오는 중 오류가 발생했습니다.');
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId, router]);

  // 변경사항 추적
  useEffect(() => {
    setIsDirty(true);
  }, [title, tags, content, excerpt]);

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

    const editorContent = textarea.value;
    if (!editorContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          tags,
          content: editorContent.trim(),
          excerpt: excerpt.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('게시글이 성공적으로 수정되었습니다.');
        setIsDirty(false);
        router.push('/blog');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('게시글 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }, [title, tags, excerpt, postId, router]);

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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
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
        
        {/* 요약 입력 */}
        <input 
          type="text" 
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="게시글 요약을 입력하세요 (선택사항)"
          className={cn(
            'w-full px-0 py-2 text-sm border-none outline-none bg-transparent mt-2',
            {
              'text-gray-300 placeholder-gray-500': isDarkMode,
              'text-gray-600 placeholder-gray-400': !isDarkMode,
            }
          )}
        />
        
        <TagInput
          tags={tags}
          onTagsChange={setTags}
          placeholder="태그를 입력하세요"
        />
      </div>

      {/* 마크다운 에디터 */}
      <div className="flex-1">
        <MarkdownEditor 
          initialContent={content}
          postId={postId}
          isNewPost={false}
        >
          <MarkdownEditor.Editor />
        </MarkdownEditor>
      </div>

      {/* 하단 푸터 */}
      <EditorFooter 
        isEdit={true}
        postId={postId}
        onPublish={handlePublish}
        onCancel={handleCancel}
        onExit={handleExit}
        saving={saving}
      />
    </div>
  );
}
  