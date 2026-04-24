import { NextRequest, NextResponse } from "next/server";
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

    if (!url) {
      return new Response("No image URL", { status: 404 });
    }

    return NextResponse.redirect(url);
  } catch {
    return new Response("Block not found", { status: 404 });
  }
}
