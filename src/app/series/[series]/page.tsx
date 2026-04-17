import { notFound } from "next/navigation";
import { BackButton } from "@/features/detail/components/BackButton";
import { HeaderActions } from "@/features/header/components/HeaderActions";
import { PostList } from "@/features/posts/components/PostList";
import { getPostsBySeries, getAllSeries } from "@/lib/notion";
import type { Metadata } from "next";

export const revalidate = 300;

interface SeriesPageProps {
  params: Promise<{ series: string }>;
}

export async function generateStaticParams() {
  const series = await getAllSeries();
  return series.map((s) => ({ series: s }));
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const { series } = await params;
  return { title: `${decodeURIComponent(series)} 시리즈 - Blog` };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { series: rawSeries } = await params;
  const series = decodeURIComponent(rawSeries);
  const posts = await getPostsBySeries(series);

  if (posts.length === 0) notFound();

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <BackButton />
        <HeaderActions />
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{series}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {posts.length}개의 게시글
        </p>
      </div>
      <PostList posts={posts} />
    </>
  );
}
