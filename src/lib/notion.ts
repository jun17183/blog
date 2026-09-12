import { cache } from "react";
import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { PostMeta } from "@/features/posts/types/post";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

/** 서버 전용 Notion 클라이언트. 라우트 핸들러도 이 인스턴스를 공유한다. */
export const notion = new Client({ auth: requireEnv("NOTION_TOKEN") });
const dataSourceId = requireEnv("NOTION_DATABASE_ID");

function pageToPostMeta(page: PageObjectResponse): PostMeta {
  const props = page.properties;

  const titleProp = props.Title;
  const title =
    titleProp?.type === "title"
      ? titleProp.title.map((t) => t.plain_text).join("")
      : "";

  const slugProp = props.Slug;
  const slug =
    slugProp?.type === "rich_text"
      ? slugProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const descProp = props.Description;
  const description =
    descProp?.type === "rich_text"
      ? descProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const dateProp = props.Date;
  const date =
    dateProp?.type === "date" ? (dateProp.date?.start ?? "") : "";

  const tagsProp = props.Tags;
  const tags =
    tagsProp?.type === "multi_select"
      ? tagsProp.multi_select.map((t) => t.name)
      : [];

  const seriesProp = props.Series;
  const series =
    seriesProp?.type === "select"
      ? (seriesProp.select?.name ?? null)
      : seriesProp?.type === "rich_text" && seriesProp.rich_text.length > 0
        ? seriesProp.rich_text.map((t) => t.plain_text).join("")
        : null;

  const thumbProp = props.Thumbnail;
  const hasThumb = thumbProp?.type === "files" && thumbProp.files.length > 0;
  const thumbnail = hasThumb ? `/api/notion-image/page/${page.id}` : null;

  const pubProp = props.Published;
  const published =
    pubProp?.type === "checkbox" ? pubProp.checkbox : false;

  return {
    id: page.id,
    title,
    slug,
    description,
    date,
    tags,
    series,
    thumbnail,
    published,
  };
}

/**
 * 한 번의 렌더(요청) 안에서 여러 컴포넌트가 호출해도 Notion API는 한 번만 탄다.
 * Notion SDK는 fetch 캐시를 타지 않으므로 React cache()로 dedup한다.
 */
export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(pageToPostMeta);
});

export const getPostBySlug = cache(async (slug: string): Promise<PostMeta | null> => {
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        { property: "Slug", rich_text: { equals: slug } },
        { property: "Published", checkbox: { equals: true } },
      ],
    },
  });

  const page = response.results.find(
    (r): r is PageObjectResponse => "properties" in r,
  );
  if (!page) return null;
  return pageToPostMeta(page);
});

type NotionBlock = Extract<
  Awaited<ReturnType<typeof notion.blocks.children.list>>["results"][number],
  { type: string }
>;

export type BlockWithChildren = NotionBlock & {
  children?: BlockWithChildren[];
};

async function fetchBlocks(blockId: string): Promise<BlockWithChildren[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    blocks.push(
      ...response.results.filter(
        (b): b is NotionBlock => "type" in b,
      ),
    );

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  const blocksWithChildren: BlockWithChildren[] = await Promise.all(
    blocks.map(async (block) => {
      if (block.has_children) {
        const children = await fetchBlocks(block.id);
        return { ...block, children };
      }
      return block;
    }),
  );

  return blocksWithChildren;
}

export async function getPostBlocks(pageId: string): Promise<BlockWithChildren[]> {
  return fetchBlocks(pageId);
}

export async function getAllTags(): Promise<{ name: string; count: number }[]> {
  const posts = await getAllPosts();
  const tagMap = posts
    .flatMap((post) => post.tags)
    .reduce((map, tag) => map.set(tag, (map.get(tag) ?? 0) + 1), new Map<string, number>());

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getAllSeries(): Promise<string[]> {
  const posts = await getAllPosts();
  const names = posts
    .map((post) => post.series)
    .filter((series): series is string => series !== null && series !== "");
  return [...new Set(names)];
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

export async function getPostsBySeries(series: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts
    .filter((post) => post.series === series)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export interface Profile {
  name: string;
  bio: string;
  github: string | null;
  linkedin: string | null;
  avatar: string | null;
  defaultThumbnails: string[];
}

/** Build a proxy URL for a Notion image block */
function blockImageProxy(blockId: string): string {
  return `/api/notion-image/block/${blockId}`;
}

export async function getProfile(): Promise<Profile> {
  const pageId = process.env.NOTION_PROFILE_PAGE_ID;
  if (!pageId) {
    return { name: "@Blog", bio: "", github: null, linkedin: null, avatar: null, defaultThumbnails: [] };
  }

  const { results } = await notion.blocks.children.list({ block_id: pageId });

  const profile: Profile = { name: "", bio: "", github: null, linkedin: null, avatar: null, defaultThumbnails: [] };
  let imageIndex = 0;

  for (const block of results) {
    if (!("type" in block)) continue;
    if (block.type === "paragraph") {
      const text = block.paragraph.rich_text.map((t) => t.plain_text).join("");
      const lines = text.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("이름:")) profile.name = trimmed.replace("이름:", "").trim();
        else if (trimmed.startsWith("소개:")) profile.bio = trimmed.replace("소개:", "").trim();
        else if (trimmed.startsWith("GitHub:")) profile.github = trimmed.replace("GitHub:", "").trim();
        else if (trimmed.startsWith("LinkedIn:")) profile.linkedin = trimmed.replace("LinkedIn:", "").trim();
      }
    } else if (block.type === "image") {
      const hasUrl =
        (block.image.type === "file" && block.image.file.url) ||
        (block.image.type === "external" && block.image.external.url);
      if (hasUrl) {
        const proxyUrl = blockImageProxy(block.id);
        if (imageIndex === 0) {
          profile.avatar = proxyUrl;
        } else {
          profile.defaultThumbnails.push(proxyUrl);
        }
        imageIndex++;
      }
    }
  }

  return profile;
}
