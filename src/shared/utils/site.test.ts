import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "./site";

describe("getSiteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("NEXT_PUBLIC_SITE_URL을 최우선으로 쓰고 끝 슬래시를 제거한다", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://blog.example.com/");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "blog.vercel.app");
    expect(getSiteUrl()).toBe("https://blog.example.com");
  });

  it("없으면 Vercel 프로덕션 도메인으로 https URL을 만든다", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "blog.vercel.app");
    expect(getSiteUrl()).toBe("https://blog.vercel.app");
  });

  it("둘 다 없으면 localhost", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
