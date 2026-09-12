import { notFound } from "next/navigation";
import { ContentLayout } from "@/features/sidebar/components/ContentLayout";
import { PostRowList } from "@/features/posts/components/PostRowList";
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
  return { title: `${decodeURIComponent(series)} 시리즈` };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { series: rawSeries } = await params;
  const series = decodeURIComponent(rawSeries);
  const posts = await getPostsBySeries(series);

  if (posts.length === 0) notFound();

  return (
    <ContentLayout>
      <p className="mb-6 text-xs text-faint">
        {series} · {posts.length}
      </p>
      <PostRowList posts={posts} />
    </ContentLayout>
  );
}
