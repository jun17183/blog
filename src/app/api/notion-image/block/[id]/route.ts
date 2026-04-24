import { NextRequest } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

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

    const contentType = res.headers.get("content-type") ?? "image/png";
    const body = await res.arrayBuffer();

    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response("Block not found", { status: 404 });
  }
}
