import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

// Notion 쿼리 결과 타입
export type NotionPost = QueryDatabaseResponse["results"][number];

// 게시글 목록 응답 타입
export type PostsResponse = NotionPost[];

// 게시글 상세 응답 타입
export interface PostDetailResponse {
  page: unknown;
  blocks: unknown[];
}

