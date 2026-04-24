import { NextRequest, NextResponse } from "next/server";
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

    return NextResponse.redirect(url);
  } catch {
    return new Response("Page not found", { status: 404 });
  }
}
