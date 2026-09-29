import { describe, expect, it } from "vitest";
import { sortByDateDesc } from "./sort";

const post = (slug: string, date: string) => ({ slug, date });

describe("sortByDateDesc", () => {
  it("최신 글이 먼저 온다", () => {
    const sorted = sortByDateDesc([post("old", "2026-01-01"), post("new", "2026-08-18"), post("mid", "2026-05-02")]);
    expect(sorted.map((p) => p.slug)).toEqual(["new", "mid", "old"]);
  });

  it("날짜가 없는 글은 맨 뒤로 보낸다", () => {
    const sorted = sortByDateDesc([post("none", ""), post("a", "2026-01-01")]);
    expect(sorted.map((p) => p.slug)).toEqual(["a", "none"]);
  });

  it("원본 배열을 바꾸지 않는다", () => {
    const input = [post("old", "2026-01-01"), post("new", "2026-08-18")];
    sortByDateDesc(input);
    expect(input.map((p) => p.slug)).toEqual(["old", "new"]);
  });
});
