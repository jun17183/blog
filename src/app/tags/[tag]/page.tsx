import { notFound } from "next/navigation";
import { BackButton } from "@/features/detail/components/BackButton";
import { HeaderActions } from "@/features/header/components/HeaderActions";
import { PostList } from "@/features/posts/components/PostList";
import { getPostsByTag, getAllTags } from "@/lib/notion";
import type { Metadata } from "next";

export const revalidate = 300;

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag: tag.name }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return { title: `${decodeURIComponent(tag)} - Blog` };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) notFound();

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <BackButton />
        <HeaderActions />
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-muted-foreground">#</span> {tag}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {posts.length}개의 게시글
        </p>
      </div>
      <PostList posts={posts} />
    </>
  );
}
