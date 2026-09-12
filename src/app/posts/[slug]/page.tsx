import { notFound } from "next/navigation";
import { BackButton } from "@/features/detail/components/BackButton";
import { HeaderActions } from "@/features/header/components/HeaderActions";
import { PostTagBadge } from "@/features/posts/components/PostTagBadge";
import { NotionRenderer } from "@/features/detail/notion/NotionRenderer";
import { GiscusComments } from "@/features/comments/components/GiscusComments";
import { getPostBySlug, getPostBlocks, getAllPosts } from "@/lib/notion";
import { formatDate } from "@/shared/utils/date";
import type { Metadata } from "next";

export const revalidate = 60;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const post = await getPostBySlug(decodeURIComponent(rawSlug));
  if (!post) return { title: "Not Found" };

  const description = post.description || undefined;
  const images = post.thumbnail ? [post.thumbnail] : undefined;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/posts/${encodeURIComponent(post.slug)}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.date || undefined,
      tags: post.tags,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const blocks = await getPostBlocks(post.id);

  return (
    <>
    <div className="flex items-center justify-between gap-4 mb-4">
      <BackButton />
      <HeaderActions />
    </div>
    <article className="rounded-2xl border border-border bg-surface p-8 md:p-12 shadow-sm">
      <header className="mb-10">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-2 mt-3 text-[11px] uppercase tracking-[0.06em] text-faint">
          <span>{formatDate(post.date)}</span>
          {post.series && (
            <>
              <span className="inline-block w-[3px] h-[3px] rounded-full bg-faint" />
              <span>{post.series}</span>
            </>
          )}
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {post.tags.map((tag) => (
              <PostTagBadge key={tag} name={tag} />
            ))}
          </div>
        )}
      </header>
      <div className="notion-content">
        <NotionRenderer blocks={blocks} />
      </div>
      <GiscusComments term={slug} />
    </article>
    </>
  );
}
