import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { PostMeta } from "@/features/posts/types/post";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const dataSourceId = process.env.NOTION_DATABASE_ID!;

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
  const thumbnail =
    thumbProp?.type === "files" && thumbProp.files.length > 0
      ? thumbProp.files[0].type === "file"
        ? thumbProp.files[0].file.url
        : thumbProp.files[0].type === "external"
          ? thumbProp.files[0].external.url
          : null
      : null;

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

export async function getAllPosts(): Promise<PostMeta[]> {
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
}

export async function getPostBySlug(
  slug: string,
): Promise<PostMeta | null> {
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
}

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
  return [...new Set(posts.map((post) => post.series).filter(Boolean))] as string[];
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
      const url =
        block.image.type === "file"
          ? block.image.file.url
          : block.image.type === "external"
            ? block.image.external.url
            : null;
      if (url) {
        if (imageIndex === 0) {
          profile.avatar = url;
        } else {
          profile.defaultThumbnails.push(url);
        }
        imageIndex++;
      }
    }
  }

  return profile;
}
