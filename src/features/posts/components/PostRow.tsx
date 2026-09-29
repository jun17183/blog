import Link from "next/link";
import { formatDateCompact } from "@/shared/utils/date";
import type { PostMeta } from "@/features/posts/types/post";

interface PostRowProps {
  post: PostMeta;
}

/** 목업의 글 한 줄: 제목 + 날짜(mono), 설명, 태그(mono). 번호 없음. */
export function PostRow({ post }: PostRowProps) {
  return (
    <article className="group border-t border-border py-8 first:border-t-0 first:pt-0">
      <Link
        href={`/posts/${encodeURIComponent(post.slug)}`}
        className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      >
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-[22px] font-medium leading-[1.25] tracking-[-0.03em] transition-colors duration-200 group-hover:text-link-hover md:text-2xl">
            {post.title}
          </h2>
          {post.date && (
            <time dateTime={post.date} className="shrink-0 text-[13px] text-muted-foreground tabular-nums">
              {formatDateCompact(post.date)}
            </time>
          )}
        </div>
        {post.description && (
          <p className="mt-3 text-sm leading-[1.7] text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
            {post.description}
          </p>
        )}
        {post.tags.length > 0 && (
          <p className="mt-3 text-[13px] text-muted-foreground">{post.tags.join(" · ")}</p>
        )}
      </Link>
    </article>
  );
}
