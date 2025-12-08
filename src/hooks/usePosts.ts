import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import type { PostsResponse, PostDetailResponse } from "@/types/post";

const fetchPosts = async (): Promise<PostsResponse> => {
  const res = await fetch("/api/posts");

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
};

const fetchPost = async (id: string): Promise<PostDetailResponse> => {
  const res = await fetch(`/api/posts/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  return res.json();
};

export const usePosts = () =>
  useQuery({
    queryKey: queryKeys.posts.all,
    queryFn: fetchPosts,
  });

export const usePost = (id: string) =>
  useQuery({
    queryKey: queryKeys.post.byId(id),
    queryFn: () => fetchPost(id),
    enabled: !!id,
  });