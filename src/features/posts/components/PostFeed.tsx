"use client";

import { useSearch } from "../hooks/useSearch";
import { SearchInput } from "./SearchInput";
import { PostList } from "./PostList";
import type { PostMeta } from "@/features/posts/types/post";

interface PostFeedProps {
  posts: PostMeta[];
  defaultThumbnails?: string[];
}

export function PostFeed({ posts, defaultThumbnails = [] }: PostFeedProps) {
  const { query, setQuery, filtered } = useSearch(posts);

  return (
    <div className="flex flex-col gap-6">
      <SearchInput value={query} onChange={setQuery} />
      <PostList posts={filtered} defaultThumbnails={defaultThumbnails} />
    </div>
  );
}
