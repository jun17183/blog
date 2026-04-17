import Link from "next/link";
import Image from "next/image";
import { PostTagBadge } from "./PostTagBadge";
import { formatDate } from "@/shared/utils/date";
import type { PostMeta } from "@/features/posts/types/post";

interface PostCardProps {
  post: PostMeta;
  defaultThumbnail?: string;
}

const COVER_GRADIENTS = [
  "from-indigo-500/20 via-purple-500/20 to-pink-500/20",
  "from-cyan-500/20 to-blue-600/20",
  "from-amber-400/20 to-red-500/20",
  "from-emerald-500/20 to-green-600/20",
  "from-violet-500/20 to-fuchsia-500/20",
  "from-rose-400/20 to-orange-500/20",
];

export function PostCard({ post, defaultThumbnail }: PostCardProps) {
  const hash = post.id.charCodeAt(0) % COVER_GRADIENTS.length;
  const gradient = COVER_GRADIENTS[hash];

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-border-strong group-hover:shadow-lg h-full flex flex-col">
        <div className="aspect-[16/10] relative overflow-hidden shrink-0">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 33vw"
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
          <h2 className="text-base font-bold leading-snug tracking-tight line-clamp-2">
            {post.title}
          </h2>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] uppercase tracking-[0.06em] text-faint">
            <span>{formatDate(post.date)}</span>
            {post.series && (
              <>
                <span className="inline-block w-[3px] h-[3px] rounded-full bg-faint" />
                <span>{post.series}</span>
              </>
            )}
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
