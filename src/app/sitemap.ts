import type { MetadataRoute } from "next";
import { getAllPosts, getAllSeries, getAllTags } from "@/lib/notion";
import { getSiteUrl } from "@/shared/utils/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [posts, tags, series] = await Promise.all([
    getAllPosts(),
    getAllTags(),
    getAllSeries(),
  ]);

  const latest = posts[0]?.date ? new Date(posts[0].date) : new Date();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/posts/${encodeURIComponent(post.slug)}`,
    lastModified: post.date ? new Date(post.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${siteUrl}/tags/${encodeURIComponent(tag.name)}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  const seriesEntries: MetadataRoute.Sitemap = series.map((name) => ({
    url: `${siteUrl}/series/${encodeURIComponent(name)}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    { url: siteUrl, lastModified: latest, changeFrequency: "daily", priority: 1 },
    ...postEntries,
    ...seriesEntries,
    ...tagEntries,
  ];
}
