import type { BlockWithChildren } from "@/lib/notion";
import type { TocItem } from "@/features/detail/components/TableOfContents";

const HEADING_LEVEL = {
  heading_1: 1,
  heading_2: 2,
  heading_3: 3,
} as const;

/**
 * 헤딩 블록의 앵커 id. 블록 id는 안정적이므로 그대로 쓴다.
 * 같은 페이지의 Notion 블록 id는 앞자리를 공유하므로 절대 잘라 쓰지 않는다.
 */
export function headingAnchorId(blockId: string): string {
  return `h-${blockId.replace(/-/g, "")}`;
}

/** 최상위 헤딩 블록만 목차로 뽑는다. */
export function extractToc(blocks: BlockWithChildren[]): TocItem[] {
  const items: TocItem[] = [];
  for (const block of blocks) {
    if (block.type !== "heading_1" && block.type !== "heading_2" && block.type !== "heading_3") continue;
    const richText =
      block.type === "heading_1"
        ? block.heading_1.rich_text
        : block.type === "heading_2"
          ? block.heading_2.rich_text
          : block.heading_3.rich_text;
    const text = richText.map((t) => t.plain_text).join("").trim();
    if (!text) continue;
    items.push({ id: headingAnchorId(block.id), text, level: HEADING_LEVEL[block.type] });
  }
  return items;
}
