"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SeriesNavProps {
  seriesNames: string[];
  activeSeries?: string | null;
}

const linkBase =
  "block whitespace-nowrap py-[7px] text-[15px] tracking-[-0.01em] transition-colors md:whitespace-normal";
const linkActive = "text-foreground";
const linkInactive = "text-faint hover:text-muted-foreground";

/** 왼쪽 메뉴. "All." + 시리즈. 모바일에서는 가로 스크롤 한 줄. */
export function SeriesNav({ seriesNames, activeSeries }: SeriesNavProps) {
  const pathname = decodeURIComponent(usePathname());
  const current =
    activeSeries !== undefined
      ? activeSeries
      : pathname.startsWith("/series/")
        ? pathname.slice("/series/".length)
        : null;

  return (
    <nav
      aria-label="Series"
      className="-mx-6 flex gap-5 overflow-x-auto px-6 md:mx-0 md:flex-col md:gap-0 md:overflow-visible md:px-0"
    >
      <Link href="/" className={`${linkBase} ${current === null ? linkActive : linkInactive}`}>
        All.
      </Link>
      {seriesNames.map((name) => (
        <Link
          key={name}
          href={`/series/${encodeURIComponent(name)}`}
          className={`${linkBase} ${current === name ? linkActive : linkInactive}`}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
}
