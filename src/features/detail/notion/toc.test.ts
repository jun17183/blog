import { describe, expect, it } from "vitest";
import { extractToc, headingAnchorId } from "./toc";
import type { BlockWithChildren } from "@/lib/notion";

function heading(type: "heading_1" | "heading_2" | "heading_3", id: string, text: string): BlockWithChildren {
  return {
    object: "block",
    id,
    type,
    has_children: false,
    [type]: { rich_text: text ? [{ plain_text: text }] : [], color: "default", is_toggleable: false },
  } as unknown as BlockWithChildren;
}

describe("headingAnchorId", () => {
  it("같은 페이지 블록처럼 앞자리가 같은 id도 서로 다른 앵커를 만든다", () => {
    const a = headingAnchorId("3455763a-6110-8040-ac30-e8077a7be228");
    const b = headingAnchorId("3455763a-6110-8040-b1f2-000000000001");
    expect(a).not.toBe(b);
    expect(a).toMatch(/^h-[0-9a-f]{32}$/);
  });
});

describe("extractToc", () => {
  it("최상위 헤딩만 레벨과 함께 뽑고, 빈 헤딩은 건너뛴다", () => {
    const toc = extractToc([
      heading("heading_1", "a-1", "서버"),
      { object: "block", id: "p-1", type: "paragraph", has_children: false, paragraph: { rich_text: [] } } as unknown as BlockWithChildren,
      heading("heading_2", "a-2", "컨테이너"),
      heading("heading_3", "a-3", ""),
    ]);
    expect(toc).toEqual([
      { id: headingAnchorId("a-1"), text: "서버", level: 1 },
      { id: headingAnchorId("a-2"), text: "컨테이너", level: 2 },
    ]);
  });
});
