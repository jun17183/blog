import Link from "next/link";
import { PostTagBadge } from "./PostTagBadge";
import { formatDate } from "@/shared/utils/date";
import type { PostMeta } from "@/features/posts/types/post";

interface PostCardProps {
  post: PostMeta;
  defaultThumbnail?: string;
}

export function PostCard({ post, defaultThumbnail }: PostCardProps) {
  return (
    <Link href={`/posts/${encodeURIComponent(post.slug)}`} className="group block">
      <article className="rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-border-strong group-hover:shadow-lg h-full flex flex-col">
        <div className="aspect-[16/10] relative overflow-hidden shrink-0">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : defaultThumbnail ? (
            <div className="w-full h-full bg-surface-elevated flex items-center justify-center">
              <img
                src={defaultThumbnail}
                alt=""
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-surface-elevated" />
          )}
        </div>
        <div className="p-5 relative h-[180px]">
          <h2 className="text-lg font-bold leading-snug tracking-tight line-clamp-2">
            {post.title}
          </h2>
          <div className="mt-2 text-[11px] uppercase tracking-[0.06em] text-faint">
            <span>{formatDate(post.date)}</span>
          </div>
          {post.description && (
            <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
              {post.description}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map((tag) => (
                <PostTagBadge key={tag} name={tag} />
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
