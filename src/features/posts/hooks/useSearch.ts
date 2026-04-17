"use client";

import { useState, useMemo } from "react";
import type { PostMeta } from "@/features/posts/types/post";

export function useSearch(posts: PostMeta[]) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return posts;

    const lower = query.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lower) ||
        post.description.toLowerCase().includes(lower) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lower)),
    );
  }, [posts, query]);

  return { query, setQuery, filtered };
}
