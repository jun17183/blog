'use client'
import { useEffect, use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useAtom } from 'jotai';
import { darkModeAtom, authAtom } from '@/atoms/blogAtoms';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  updated?: string;
  tags: string[];
  content: string;
}

export default function BlogDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [isDarkMode] = useAtom(darkModeAtom);
  const [auth] = useAtom(authAtom);
  const { data: session } = useSession();
  const isAdmin = auth.isAdmin || session?.isAdmin;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 페이지 진입 시 스크롤을 맨 위로 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 게시글 로드
  useEffect(() => {
    const loadPost = async () => {
      try {
        // slug로 게시글을 찾기 위해 모든 게시글을 가져와서 필터링
        const response = await fetch('/api/posts');
        const result = await response.json();

        if (result.success) {
          const foundPost = result.posts.find((p: Post) => p.slug === slug);
          if (foundPost) {
            setPost(foundPost);
          } else {
            setError('게시글을 찾을 수 없습니다.');
          }
        } else {
          setError('게시글을 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('Failed to load post:', error);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!post || !confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('게시글이 삭제되었습니다.');
        router.push('/blog');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

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

  if (error || !post) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || '게시글을 찾을 수 없습니다.'}</p>
          <button 
            onClick={() => router.push('/blog')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => router.back()}
        className={cn(
          'flex items-center gap-2 mb-6 px-3 py-2 rounded-lg transition-colors',
          {
            'text-gray-300 hover:bg-gray-800': isDarkMode,
            'text-gray-600 hover:bg-gray-100': !isDarkMode,
          }
        )}
      >
        <ArrowLeft size={16} />
        뒤로가기
      </button>

      <article>
        <header className="mb-8">
          <h1 className={cn(
            'text-4xl font-bold mb-4',
            {
              'text-white': isDarkMode,
              'text-gray-900': !isDarkMode,
            }
          )}>
            {post.title}
          </h1>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className={cn(
                'text-sm',
                {
                  'text-gray-400': isDarkMode,
                  'text-gray-500': !isDarkMode,
                }
              )}>
                {post.date}
                {post.updated && post.updated !== post.date && (
                  <span className="ml-2 text-xs opacity-75">
                    (수정: {post.updated})
                  </span>
                )}
              </span>
              
              <div className="flex gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      {
                        'bg-gray-700 text-gray-300': isDarkMode,
                        'bg-gray-100 text-gray-600': !isDarkMode,
                      }
                    )}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 관리자 액션 버튼들 */}
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <Link
                  href={`/editor/${post.id}`}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                    {
                      'text-gray-400 hover:text-blue-400 hover:bg-gray-800': isDarkMode,
                      'text-gray-500 hover:text-blue-600 hover:bg-gray-100': !isDarkMode,
                    }
                  )}
                >
                  <Edit size={16} />
                  수정
                </Link>
                
                <button
                  onClick={handleDeletePost}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                    {
                      'text-gray-400 hover:text-red-400 hover:bg-gray-800': isDarkMode,
                      'text-gray-500 hover:text-red-600 hover:bg-gray-100': !isDarkMode,
                    }
                  )}
                >
                  <Trash2 size={16} />
                  삭제
                </button>
              </div>
            )}
          </div>
        </header>
        
        <div className={cn(
          'prose prose-lg max-w-none',
          {
            'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-gray-300 prose-pre:bg-gray-800 prose-blockquote:text-gray-400 prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300': isDarkMode,
            'prose-gray prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-gray-800 prose-pre:bg-gray-100 prose-blockquote:text-gray-600 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700': !isDarkMode,
          }
        )}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}