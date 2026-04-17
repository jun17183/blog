"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SeriesInfo {
  name: string;
  count: number;
}

interface TabBarProps {
  postCount?: number;
  seriesList?: SeriesInfo[];
}

export function TabBar({ postCount, seriesList = [] }: TabBarProps) {
  const pathname = usePathname();

  const decodedPathname = decodeURIComponent(pathname);
  const isAllActive =
    decodedPathname === "/" || decodedPathname.startsWith("/tags");

  const tabBase =
    "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium tracking-tight transition-all";
  const tabInactive = "text-muted-foreground hover:text-foreground hover:bg-surface-elevated";
  const tabActive = "bg-surface text-foreground shadow-card";

  return (
    <div className="flex justify-center">
      <div className="glass inline-flex gap-1 rounded-full p-1 overflow-x-auto">
        <Link
          href="/"
          className={`${tabBase} ${isAllActive ? tabActive : tabInactive}`}
        >
          ALL
          {postCount != null && (
            <span className="ml-1 opacity-70">({postCount})</span>
          )}
        </Link>
        {seriesList.map((series) => {
          const href = `/series/${series.name}`;
          const isActive = decodedPathname === href;

          return (
            <Link
              key={series.name}
              href={href}
              className={`${tabBase} ${isActive ? tabActive : tabInactive}`}
            >
              {series.name}
              <span className="ml-1 opacity-70">({series.count})</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
