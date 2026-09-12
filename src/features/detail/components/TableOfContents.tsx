"use client";

import { useEffect, useState } from "react";

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

/** 우측 스티키 목차. 화면 상단을 지난 마지막 헤딩을 현재 항목으로 표시한다. */
export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const OFFSET = 96;
    const update = () => {
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top - OFFSET <= 0) current = heading.id;
        else break;
      }
      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-[13px] leading-snug">
      <ul className="flex flex-col gap-2 border-l border-border">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className={`-ml-px border-l ${isActive ? "border-foreground" : "border-transparent"}`}>
              <a
                href={`#${item.id}`}
                className={`block py-0.5 pl-4 transition-colors ${LEVEL_INDENT[item.level]} ${
                  isActive ? "text-foreground" : "text-faint hover:text-muted-foreground"
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
