import { NextRequest } from "next/server";
import { notion } from "@/lib/notion";

// SVG는 스크립트를 품을 수 있어 직접 열면 우리 origin에서 실행된다. 래스터 이미지만 통과시킨다.
const SAFE_IMAGE_TYPES = /^image\/(png|jpe?g|gif|webp|avif|bmp|x-icon)(;|$)/i;

function isSafeImageType(contentType: string): boolean {
  return SAFE_IMAGE_TYPES.test(contentType);
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const block = await notion.blocks.retrieve({ block_id: id });

    if (!("type" in block) || block.type !== "image") {
      return new Response("Not an image block", { status: 404 });
    }

    const url =
      block.image.type === "file"
        ? block.image.file.url
        : block.image.type === "external"
          ? block.image.external.url
          : null;

    if (!url || url.trim() === "") {
      return new Response("No image URL", { status: 404 });
    }

    const res = await fetch(url);
    if (!res.ok) {
      return new Response("Image fetch failed", { status: 502 });
    }

    // 이미지가 아닌 응답(HTML 등)을 우리 도메인으로 흘려보내지 않는다.
    const contentType = res.headers.get("content-type") ?? "";
    if (!isSafeImageType(contentType)) {
      return new Response("Not an image", { status: 415 });
    }
    const body = await res.arrayBuffer();

    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: unknown) {
    // 설정 오류(토큰/권한)와 진짜 404가 로그에서 구분되도록 남긴다.
    console.error("[notion-image/block] fetch failed", id, error instanceof Error ? error.message : error);
    return new Response("Block not found", { status: 404 });
  }
}
