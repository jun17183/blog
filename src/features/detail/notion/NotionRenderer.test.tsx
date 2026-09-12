import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NotionRenderer } from "./NotionRenderer";
import type { BlockWithChildren } from "@/lib/notion";

// 테스트에 필요한 최소 필드만 채운 Notion 블록 팩토리.
function richText(content: string) {
  // Notion API는 빈 블록의 rich_text를 빈 배열로 준다.
  if (content === "") return [];
  return [
    {
      type: "text",
      text: { content, link: null },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: "default",
      },
      plain_text: content,
      href: null,
    },
  ];
}

let seq = 0;
function block(type: string, text: string, children?: BlockWithChildren[]): BlockWithChildren {
  seq += 1;
  const base = {
    object: "block",
    id: `block-${seq}`,
    has_children: Boolean(children),
    archived: false,
    in_trash: false,
    type,
    children,
  };
  const payload = { rich_text: richText(text), color: "default" };
  // 테스트 픽스처 한정: Notion의 거대한 discriminated union을 채우지 않고 필요한 필드만 만든다.
  // 프로덕션 코드에서 이 캐스트 패턴을 따라 쓰지 말 것.
  return { ...base, [type]: payload } as unknown as BlockWithChildren;
}

function render(blocks: BlockWithChildren[]): string {
  return renderToStaticMarkup(<NotionRenderer blocks={blocks} />);
}

describe("NotionRenderer", () => {
  it("연속된 번호 리스트는 하나의 <ol>로 묶고, 빈 문단으로 끊기면 새 <ol>을 만든다", () => {
    const html = render([
      block("numbered_list_item", "하나"),
      block("numbered_list_item", "둘"),
      block("paragraph", ""),
      block("numbered_list_item", "다시 하나"),
    ]);
    expect(html.match(/<ol/g)).toHaveLength(2);
    expect(html.match(/<li/g)).toHaveLength(3);
  });

  it("빈 문단은 한 줄 높이의 여백으로 렌더한다", () => {
    const html = render([block("paragraph", "")]);
    expect(html).toContain('class="notion-block h-[1lh]"');
    expect(html).not.toContain("<p");
  });

  it("문단 안의 소프트 줄바꿈을 보존한다", () => {
    const html = render([block("paragraph", "첫 줄\n둘째 줄")]);
    expect(html).toContain("whitespace-pre-wrap");
    expect(html).toContain("첫 줄\n둘째 줄");
  });

  it("리스트 아이템의 하위 블록을 <li> 안에 중첩 렌더한다", () => {
    const html = render([
      block("bulleted_list_item", "부모", [block("bulleted_list_item", "자식")]),
    ]);
    expect(html.match(/<ul/g)).toHaveLength(2);
    expect(html).toMatch(/<li[^>]*><span>부모<\/span><ul[^>]*><li[^>]*><span>자식<\/span>/);
  });

  it("인용구는 굵은 세로선을 갖고 텍스트를 보존한다", () => {
    const html = render([block("quote", "init system\n처음 실행되는 프로그램")]);
    expect(html).toContain("<blockquote");
    expect(html).toContain("border-l-[3px]");
    expect(html).toContain("init system\n처음 실행되는 프로그램");
  });

  it("알 수 없는 블록 타입은 조용히 건너뛴다", () => {
    expect(render([block("synced_block", "")])).toBe("");
  });
});
