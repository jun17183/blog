import { notFound } from "next/navigation";
import { ContentLayout } from "@/features/sidebar/components/ContentLayout";
import { PostRowList } from "@/features/posts/components/PostRowList";
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
  return { title: `#${decodeURIComponent(tag)}` };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) notFound();

  return (
    <ContentLayout>
      <p className="mb-6 text-xs text-faint">
        #{tag} · {posts.length}
      </p>
      <PostRowList posts={posts} />
    </ContentLayout>
  );
}
