"use client";

import { usePosts } from "@/hooks/usePosts";

export default function BlogPage() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!posts || posts.length === 0) return <div>게시글이 없습니다.</div>;

  return (
    <div>
      <h1>블로그 게시글 목록</h1>
      <p>총 {posts.length}개의 게시글</p>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <pre>{JSON.stringify(post, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}

