import { describe, expect, it } from "vitest";
import { extractToc, headingAnchorId, pickActiveHeading } from "./toc";
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

describe("pickActiveHeading", () => {
  const ids = ["a", "b", "c"];

  it("아직 아무 헤딩도 기준선을 넘지 않았으면 첫 항목", () => {
    expect(pickActiveHeading(ids, [300, 800, 1400], 120)).toBe("a");
  });

  it("기준선을 지난 마지막 헤딩을 고른다", () => {
    expect(pickActiveHeading(ids, [-500, 40, 700], 120)).toBe("b");
  });

  it("목차 클릭으로 scroll-margin(32px) 위치에 멈춘 헤딩은 소수점 오차가 있어도 활성", () => {
    expect(pickActiveHeading(ids, [-900, 32.4, 650], 64)).toBe("b");
  });

  it("빈 목록이면 null", () => {
    expect(pickActiveHeading([], [], 120)).toBeNull();
  });
});
