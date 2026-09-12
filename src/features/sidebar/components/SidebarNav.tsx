"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SeriesInfo {
  name: string;
  count: number;
}

interface SidebarNavProps {
  totalCount: number;
  seriesList: SeriesInfo[];
}

export function SidebarNav({ totalCount, seriesList }: SidebarNavProps) {
  const pathname = usePathname();
  const decoded = decodeURIComponent(pathname);

  const isAllActive = decoded === "/" || decoded.startsWith("/tags");

  const linkBase =
    "flex items-center justify-between rounded-lg px-2.5 py-[7px] -mx-2.5 text-[13px] font-medium transition-all";
  const linkInactive = "text-muted-foreground hover:bg-accent-soft hover:text-foreground";
  const linkActive = "bg-accent-soft text-accent font-semibold";

  return (
    <nav className="mt-8 flex flex-col gap-0.5">
      <Link
        href="/"
        className={`${linkBase} ${isAllActive ? linkActive : linkInactive}`}
      >
        <span>All posts</span>
        <span className="text-[11px] text-faint">{totalCount}</span>
      </Link>
      {seriesList.map((series) => {
        const href = `/series/${encodeURIComponent(series.name)}`;
        const isActive = decoded === `/series/${series.name}`;
        return (
          <Link
            key={series.name}
            href={href}
            className={`${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            <span>{series.name}</span>
            <span className="text-[11px] text-faint">{series.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
