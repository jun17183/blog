"use client";

import { useEffect, useRef, useState } from "react";
import { pickActiveHeading } from "@/features/detail/notion/toc";

export interface TocItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

interface TableOfContentsProps {
  items: TocItem[];
}

const LEVEL_INDENT: Record<TocItem["level"], string> = {
  1: "pl-0",
  2: "pl-3",
  3: "pl-6",
};

// 헤딩의 scroll-mt-8(32px)보다 넉넉하게 잡아 목차 클릭으로 멈춘 헤딩이 확실히 활성이 되게 한다.
const ACTIVE_THRESHOLD = 64;

/** 우측 스티키 목차. 화면 상단을 지난 마지막 헤딩을 현재 항목으로 표시한다. */
export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  // 목차에서 클릭한 항목. 글 끝 근처 헤딩은 기준선까지 스크롤되지 않으므로
  // 사용자가 직접 스크롤하기 전까지 클릭한 항목을 유지한다.
  const pinnedId = useRef<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const ids = headings.map((heading) => heading.id);
    const update = () => {
      if (pinnedId.current) return;
      const tops = headings.map((heading) => heading.getBoundingClientRect().top);
      setActiveId(pickActiveHeading(ids, tops, ACTIVE_THRESHOLD));
    };
    const unpin = () => {
      pinnedId.current = null;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const userScrollEvents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    for (const event of userScrollEvents) window.addEventListener(event, unpin, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      for (const event of userScrollEvents) window.removeEventListener(event, unpin);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-[13px] leading-snug">
      <ul className="flex flex-col gap-1.5 border-l border-border">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className={`-ml-px border-l transition-colors ${isActive ? "border-foreground" : "border-transparent"}`}>
              <a
                href={`#${item.id}`}
                onClick={() => {
                  pinnedId.current = item.id;
                  setActiveId(item.id);
                }}
                className={`block py-0.5 pl-4 transition-colors ${LEVEL_INDENT[item.level]} ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
