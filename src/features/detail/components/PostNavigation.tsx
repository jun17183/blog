import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PostMeta } from "@/features/posts/types/post";

interface PostNavigationProps {
  prev: PostMeta | null;
  next: PostMeta | null;
}

export function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="이전 글, 다음 글" className="mt-16 grid grid-cols-2 gap-6 border-t border-border pt-8">
      {prev ? <NavLink post={prev} direction="prev" /> : <div />}
      {next && <NavLink post={next} direction="next" />}
    </nav>
  );
}

function NavLink({ post, direction }: { post: PostMeta; direction: "prev" | "next" }) {
  const isNext = direction === "next";

  return (
    <Link
      href={`/posts/${encodeURIComponent(post.slug)}`}
      className={`group block min-w-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground ${isNext ? "text-right" : ""}`}
    >
      <span className={`inline-flex items-center gap-1.5 text-[13px] text-muted-foreground ${isNext ? "flex-row-reverse" : ""}`}>
        {isNext ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
        <span>{isNext ? "다음 글" : "이전 글"}</span>
      </span>
      <span className="mt-2 block text-[15px] font-medium leading-[1.4] tracking-[-0.02em] transition-colors duration-200 group-hover:text-link-hover">
        {post.title}
      </span>
    </Link>
  );
}
