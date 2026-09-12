import { notFound } from "next/navigation";
import { BackButton } from "@/features/detail/components/BackButton";
import { NotionRenderer } from "@/features/detail/notion/NotionRenderer";
import { GiscusComments } from "@/features/comments/components/GiscusComments";
import { TableOfContents } from "@/features/detail/components/TableOfContents";
import { extractToc } from "@/features/detail/notion/toc";
import { ContentLayout } from "@/features/sidebar/components/ContentLayout";
import { getPostBySlug, getPostBlocks, getAllPosts } from "@/lib/notion";
import { formatDateCompact } from "@/shared/utils/date";
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
  const toc = extractToc(blocks);

  return (
    <ContentLayout activeSeries={post.series} right={<TableOfContents items={toc} />}>
      <BackButton />
      <article className="pt-8">
        <header className="mb-12">
          <h1 className="text-[28px] font-semibold leading-[1.3] tracking-[-0.02em] md:text-[32px]">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-faint">
            <time dateTime={post.date}>{formatDateCompact(post.date)}</time>
            {post.tags.length > 0 && <span>{post.tags.join(" · ")}</span>}
          </div>
        </header>
        <div className="notion-content">
          <NotionRenderer blocks={blocks} />
        </div>
        <GiscusComments term={slug} />
      </article>
    </ContentLayout>
  );
}
