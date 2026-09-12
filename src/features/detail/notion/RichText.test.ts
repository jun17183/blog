import { describe, expect, it } from "vitest";
import { notionColorStyle } from "./RichText";

describe("notionColorStyle", () => {
  it("default 색은 스타일을 만들지 않는다", () => {
    expect(notionColorStyle("default")).toBeUndefined();
  });

  it("글자색은 Notion 색 토큰을 참조한다", () => {
    expect(notionColorStyle("blue")).toEqual({ color: "var(--notion-blue)" });
  });

  it("배경색은 _background 접미사를 벗겨 배경 토큰을 참조한다", () => {
    expect(notionColorStyle("yellow_background")).toEqual({
      backgroundColor: "var(--notion-yellow-bg)",
    });
  });

  it("모르는 색 이름은 무시한다 (CSS 원색 유출 방지)", () => {
    expect(notionColorStyle("magenta")).toBeUndefined();
    expect(notionColorStyle("magenta_background")).toBeUndefined();
  });
});
