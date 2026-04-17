import { PostCard } from "./PostCard";
import type { PostMeta } from "@/features/posts/types/post";

interface PostListProps {
  posts: PostMeta[];
  defaultThumbnails?: string[];
}

export function PostList({ posts, defaultThumbnails = [] }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 gap-4">
        {defaultThumbnails.length > 0 && (
          <img
            src={defaultThumbnails[0]}
            alt=""
            className="w-24 h-24 rounded-full object-cover opacity-60"
          />
        )}
        <p className="text-muted-foreground">게시글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {posts.map((post, i) => (
        <div key={post.id}>
          <PostCard
            post={post}
            defaultThumbnail={
              defaultThumbnails.length > 0
                ? defaultThumbnails[i % defaultThumbnails.length]
                : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}
