import { NextRequest } from "next/server";
import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const page = await notion.pages.retrieve({ page_id: id });

    if (!("properties" in page)) {
      return new Response("Not a page", { status: 404 });
    }

    const thumbProp = (page as PageObjectResponse).properties.Thumbnail;

    if (thumbProp?.type !== "files" || thumbProp.files.length === 0) {
      return new Response("No thumbnail", { status: 404 });
    }

    const file = thumbProp.files[0];
    const url =
      file.type === "file"
        ? file.file.url
        : file.type === "external"
          ? file.external.url
          : null;

    if (!url) {
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
    return new Response("Page not found", { status: 404 });
  }
}
