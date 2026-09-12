"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TagChipsProps {
  tags: { name: string; count: number }[];
}

export function TagChips({ tags }: TagChipsProps) {
  const pathname = usePathname();
  const decoded = decodeURIComponent(pathname);

  const chipBase =
    "shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer";
  const chipInactive =
    "border-border bg-surface text-muted-foreground hover:border-accent hover:text-accent";
  const chipActive = "bg-foreground text-background border-foreground";

  const isAll = decoded === "/" || !decoded.startsWith("/tags/");

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[11px] tracking-[0.08em] text-faint font-semibold mr-1">
        Tags
</span>
      <Link
        href="/"
        className={`${chipBase} ${isAll ? chipActive : chipInactive}`}
      >
        All
      </Link>
      {tags.map((tag) => {
        const isActive = decoded === `/tags/${tag.name}`;
        return (
          <Link
            key={tag.name}
            href={`/tags/${encodeURIComponent(tag.name)}`}
            className={`${chipBase} ${isActive ? chipActive : chipInactive}`}
          >
            {tag.name}
          </Link>
        );
      })}
    </div>
  );
}
