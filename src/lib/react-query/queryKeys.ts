export const queryKeys = {
  // 게시글 목록
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters?: { page?: number; limit?: number; tag?: string; search?: string }) => 
      [...queryKeys.posts.lists(), filters] as const,
  },
  // 게시글 상세
  post: {
    all: ['post'] as const,
    byId: (id: string) => [...queryKeys.post.all, id] as const,
  },
  // 태그 통계
  tags: {
    all: ['tags'] as const,
    statistics: () => [...queryKeys.tags.all, 'statistics'] as const,
  },
} as const

