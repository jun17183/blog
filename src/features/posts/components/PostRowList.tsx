import { PostRow } from "./PostRow";
import type { PostMeta } from "@/features/posts/types/post";

interface PostRowListProps {
  posts: PostMeta[];
}

export function PostRowList({ posts }: PostRowListProps) {
  if (posts.length === 0) {
    return <p className="py-16 text-sm text-muted-foreground">게시글이 없습니다.</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostRow key={post.id} post={post} />
      ))}
    </div>
  );
}
