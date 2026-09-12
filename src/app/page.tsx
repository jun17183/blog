import { ContentLayout } from "@/features/sidebar/components/ContentLayout";
import { PostRowList } from "@/features/posts/components/PostRowList";
import { getAllPosts } from "@/lib/notion";

export const revalidate = 60;

// 검색(PostFeed/SearchInput), 썸네일 카드(PostCard), 태그 칩(TagChips)은
// 추후 재도입 예정이라 코드만 남기고 이 화면에서는 쓰지 않는다.
export default async function Home() {
  const posts = await getAllPosts();

  return (
    <ContentLayout>
      <PostRowList posts={posts} />
    </ContentLayout>
  );
}
