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
    <nav aria-label="이전 글, 다음 글" className="mt-16 grid gap-3 sm:grid-cols-2">
      {prev && <NavLink post={prev} direction="prev" />}
      {next && <NavLink post={next} direction="next" />}
    </nav>
  );
}

function NavLink({ post, direction }: { post: PostMeta; direction: "prev" | "next" }) {
  const isNext = direction === "next";

  return (
    <Link
      href={`/posts/${encodeURIComponent(post.slug)}`}
      className={`group block min-w-0 rounded-md border border-border px-5 py-4 transition-colors duration-200 hover:border-border-strong hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${isNext ? "text-right sm:col-start-2" : ""}`}
    >
      <span className={`inline-flex items-center gap-1.5 text-[13px] text-muted-foreground ${isNext ? "flex-row-reverse" : ""}`}>
        {isNext ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
        <span>{isNext ? "다음 글" : "이전 글"}</span>
      </span>
      <span className="mt-2 block truncate text-[15px] font-medium leading-[1.4] tracking-[-0.02em]">
        {post.title}
      </span>
    </Link>
  );
}
