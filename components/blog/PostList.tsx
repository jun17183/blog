import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { authAtom } from '@/atoms/blogAtoms';
import { useSession } from 'next-auth/react';
import { Edit, Trash2 } from 'lucide-react';

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

interface PostListProps {
  posts: Post[];
  isDarkMode: boolean;
  onDeletePost?: (postId: string) => void;
}

export default function PostList({ posts, isDarkMode, onDeletePost }: PostListProps) {
  const [auth] = useAtom(authAtom);
  const { data: session } = useSession();
  const isAdmin = auth.isAdmin || session?.isAdmin;
  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <article key={post.id}>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              <Link 
                href={`/blog/${post.slug}`} 
                className={cn(
                  'hover:text-blue-500 transition-colors',
                  {
                    'text-white hover:text-blue-400': isDarkMode,
                    'text-gray-900': !isDarkMode,
                  }
                )}
              >
                {post.title}
              </Link>
            </h2>
            
            <p className={cn(
              'text-lg leading-relaxed',
              {
                'text-gray-300': isDarkMode,
                'text-gray-600': !isDarkMode,
              }
            )}>
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
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
                
                <div className="flex items-center space-x-2">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
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
                      'p-2 rounded-lg transition-colors',
                      {
                        'text-gray-400 hover:text-blue-400 hover:bg-gray-800': isDarkMode,
                        'text-gray-500 hover:text-blue-600 hover:bg-gray-100': !isDarkMode,
                      }
                    )}
                    title="수정"
                  >
                    <Edit size={16} />
                  </Link>
                  
                  <button
                    onClick={() => onDeletePost?.(post.id)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      {
                        'text-gray-400 hover:text-red-400 hover:bg-gray-800': isDarkMode,
                        'text-gray-500 hover:text-red-600 hover:bg-gray-100': !isDarkMode,
                      }
                    )}
                    title="삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {index < posts.length - 1 && (
            <hr className={cn(
              'mt-8',
              {
                'border-gray-700': isDarkMode,
                'border-gray-200': !isDarkMode,
              }
            )} />
          )}
        </article>
      ))}
    </div>
  );
}