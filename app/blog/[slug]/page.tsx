'use client'
import { useEffect, use } from 'react';
import Link from 'next/link';

export default function BlogDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = use(params);
  
  // 페이지 진입 시 스크롤을 맨 위로 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Next.js로 블로그 만들기</h1>
          <div className="flex justify-between items-center text-gray-500 mb-6">
            <span>2024.01.01</span>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">#Next.js</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">#React</span>
            </div>
          </div>
          <div className="flex justify-end">
            <Link 
              href={`/editor/${slug}`}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              수정하기
            </Link>
          </div>
        </header>
        <div className="prose prose-lg max-w-none">
          <p>글 내용이 여기에 들어갑니다. (slug: {slug})</p>
        </div>
      </article>
    </div>
  );
}