import Image from 'next/image';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

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
}

// 기본 이미지 컴포넌트
function DefaultThumbnail({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className={cn(
      'w-full h-32 flex items-center justify-center relative',
      {
        'bg-gradient-to-br from-gray-700 to-gray-800 border-b border-gray-600': isDarkMode,
        'bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200': !isDarkMode,
      }
    )}>
      {/* 패턴 오버레이 */}
      <div className={cn(
        'absolute inset-0 opacity-10',
        {
          'bg-gradient-to-r from-blue-500/20 to-purple-500/20': isDarkMode,
          'bg-gradient-to-r from-blue-100/50 to-purple-100/50': !isDarkMode,
        }
      )} />
      
      <FileText 
        size={32} 
        className={cn(
          'relative z-10',
          {
            'text-gray-400': isDarkMode,
            'text-gray-500': !isDarkMode,
          }
        )} 
      />
    </div>
  );
}

// 썸네일 이미지 추출 함수
function extractThumbnailFromContent(content: string): string | null {
  const imageRegex = /!\[.*?\]\(([^)]+)\)/;
  const match = content.match(imageRegex);
  return match ? match[1] : null;
}

export default function PostList({ posts, isDarkMode }: PostListProps) {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => {
        const thumbnailUrl = extractThumbnailFromContent(post.content);
        
        return (
          <article 
            key={post.id}
            className={cn(
              'rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col',
              {
                'bg-gray-800 border border-gray-700': isDarkMode,
                'bg-white border border-gray-200': !isDarkMode,
              }
            )}
            onClick={() => window.location.href = `/blog/${post.slug}`}
          >
            {/* 썸네일 이미지 */}
            <div className="relative h-32 overflow-hidden">
              {thumbnailUrl ? (
                <Image
                  src={thumbnailUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={thumbnailUrl.startsWith('/api/images/')}
                />
              ) : (
                <DefaultThumbnail isDarkMode={isDarkMode} />
              )}
              
            </div>
            
            {/* 카드 내용 */}
            <div className={cn(
              'p-3 flex flex-col flex-1',
              {
                'bg-gray-800': isDarkMode,
                'bg-white': !isDarkMode,
              }
            )}>
              {/* 제목 */}
              <h2 className="text-base font-semibold mb-2 line-clamp-2">
                <span className={cn(
                  'transition-colors',
                  {
                    'text-white': isDarkMode,
                    'text-gray-900': !isDarkMode,
                  }
                )}>
                  {post.title}
                </span>
              </h2>
              
              {/* 본문 내용 (요약) */}
              <div className={cn(
                'text-sm leading-relaxed mb-5 max-h-10 overflow-hidden break-words flex-1',
                {
                  'text-gray-300': isDarkMode,
                  'text-gray-600': !isDarkMode,
                }
              )}>
                {(() => {
                  // excerpt가 있으면 사용, 없으면 content에서 추출
                  let rawText = post.excerpt || post.content.replace(/^---[\s\S]*?---\n/, '');
                  
                  // 마크다운 문법 제거
                  rawText = rawText
                    // 헤딩 제거 (# ## ###)
                    .replace(/^#{1,6}\s+/gm, '')
                    // 볼드/이탤릭 제거 (**text** *text*)
                    .replace(/\*\*([^*]+)\*\*/g, '$1')
                    .replace(/\*([^*]+)\*/g, '$1')
                    // 링크 제거 ([text](url))
                    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                    // 이미지 제거 (![alt](url))
                    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
                    // 코드 블록 제거 (```code```)
                    .replace(/```[\s\S]*?```/g, '')
                    // 인라인 코드 제거 (`code`)
                    .replace(/`([^`]+)`/g, '$1')
                    // 리스트 제거 (- * +)
                    .replace(/^[\s]*[-*+]\s+/gm, '')
                    // 번호 리스트 제거 (1. 2. 3.)
                    .replace(/^[\s]*\d+\.\s+/gm, '')
                    // 인용문 제거 (> text)
                    .replace(/^>\s*/gm, '')
                    // 수평선 제거 (--- ***)
                    .replace(/^[-*_]{3,}$/gm, '')
                    // HTML 태그 제거
                    .replace(/<[^>]*>/g, '');
                  
                  // 줄바꿈 문자 제거 및 공백 정리
                  const cleanText = rawText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
                  
                  // 총 텍스트 길이 기준으로 자르기 (100자)
                  const maxLength = 100;
                  const truncatedText = cleanText.length > maxLength 
                    ? cleanText.substring(0, maxLength) + '...'
                    : cleanText;
                  
                  return truncatedText;
                })()}
              </div>
              
              {/* 태그들 - 항상 하단에 고정 */}
              {post.tags.length > 0 && (
                <div className="flex items-center space-x-1 flex-wrap mt-auto">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => {
                    // 긴 태그 처리 (최대 12자)
                    const displayTag = tag.length > 12 ? tag.substring(0, 12) + '...' : tag;
                    
                    return (
                      <span
                        key={tagIndex}
                        className={cn(
                          'px-1.5 py-0.5 rounded text-xs font-medium max-w-[80px] truncate',
                          {
                            'bg-gray-700 text-gray-300': isDarkMode,
                            'bg-gray-100 text-gray-600': !isDarkMode,
                          }
                        )}
                        title={tag} // 전체 태그명을 툴팁으로 표시
                      >
                        #{displayTag}
                      </span>
                    );
                  })}
                  {post.tags.length > 3 && (
                    <span className={cn(
                      'text-xs',
                      {
                        'text-gray-400': isDarkMode,
                        'text-gray-500': !isDarkMode,
                      }
                    )}>
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}