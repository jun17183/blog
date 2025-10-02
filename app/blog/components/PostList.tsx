import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  tags: string[];
}

interface PostListProps {
  posts: Post[];
  isDarkMode: boolean;
}

export default function PostList({ posts, isDarkMode }: PostListProps) {
  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <article key={post.id}>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              <Link 
                href={`/blog/${post.slug}`} 
                className={`hover:text-blue-500 transition-colors ${
                  isDarkMode ? 'text-white hover:text-blue-400' : 'text-gray-900'
                }`}
              >
                {post.title}
              </Link>
            </h2>
            
            <p className={`text-lg leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {post.date}
              </span>
              
              <div className="flex items-center space-x-2">
                {post.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {index < posts.length - 1 && (
            <hr className={`mt-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />
          )}
        </article>
      ))}
    </div>
  );
}