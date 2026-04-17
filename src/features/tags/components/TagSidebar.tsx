import Link from "next/link";
import { getAllTags } from "@/lib/notion";

interface TagSidebarProps {
  tags?: { name: string; count: number }[];
  totalCount?: number;
  basePath?: string;
}

export async function TagSidebar({ tags, totalCount, basePath = "" }: TagSidebarProps) {
  const resolvedTags = tags ?? (await getAllTags());
  const resolvedTotal = totalCount ?? resolvedTags.reduce((sum, t) => sum + t.count, 0);

  return (
    <aside className="w-40 shrink-0 glass rounded-2xl p-3">
      <h2 className="px-2.5 pt-1 pb-2 text-xs font-bold tracking-tight text-foreground">
        Tags
      </h2>
      <ul className="flex flex-col gap-0.5">
        <li>
          <Link
            href={basePath || "/"}
            className="block rounded-lg px-2.5 py-1 text-[13px] text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
          >
            all ({resolvedTotal})
          </Link>
        </li>
        {resolvedTags.map((tag) => (
          <li key={tag.name}>
            <Link
              href={`/tags/${tag.name}`}
              className="block truncate rounded-lg px-2.5 py-1 text-[13px] text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
            >
              {tag.name} ({tag.count})
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
