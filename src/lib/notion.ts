import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const getPosts = async () => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID as string,
  });
  return response.results;
};

export const getPost = async (pageId: string) => {
  const [page, blocks] = await Promise.all([
    notion.pages.retrieve({ page_id: pageId }),
    notion.blocks.children.list({ block_id: pageId }),
  ]);
  return { page, blocks: blocks.results };
};