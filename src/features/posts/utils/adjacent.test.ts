import { describe, expect, it } from "vitest";
import { findAdjacentPosts } from "./adjacent";

const posts = [{ slug: "new" }, { slug: "mid" }, { slug: "old" }];

describe("findAdjacentPosts", () => {
  it("이전 글은 더 오래된 글, 다음 글은 더 최신 글이다", () => {
    const { prev, next } = findAdjacentPosts(posts, "mid");
    expect(prev?.slug).toBe("old");
    expect(next?.slug).toBe("new");
  });

  it("양 끝 글은 한쪽이 없다", () => {
    expect(findAdjacentPosts(posts, "new").next).toBeNull();
    expect(findAdjacentPosts(posts, "old").prev).toBeNull();
  });

  it("목록에 없는 글은 둘 다 없다", () => {
    expect(findAdjacentPosts(posts, "none")).toEqual({ prev: null, next: null });
  });
});
