import { getPost } from "@/lib/notion";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await getPost(id);
  return NextResponse.json(post);
}