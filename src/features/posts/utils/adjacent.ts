/** 최신순 목록 기준 이전 글(더 오래된 글)과 다음 글(더 최신 글). 목록에 없으면 둘 다 null. */
export function findAdjacentPosts<T extends { slug: string }>(
  posts: readonly T[],
  slug: string,
): { prev: T | null; next: T | null } {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}
