import { PostFeed } from "@/features/posts/components/PostFeed";
import { TagChips } from "@/features/tags/components/TagChips";
import { HeaderActions } from "@/features/header/components/HeaderActions";
import { getAllPosts, getAllTags, getProfile } from "@/lib/notion";

export const revalidate = 60;

export default async function Home() {
  const [posts, tags, profile] = await Promise.all([
    getAllPosts(),
    getAllTags(),
    getProfile(),
  ]);

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <TagChips tags={tags} />
        <HeaderActions />
      </div>
      <PostFeed posts={posts} defaultThumbnails={profile.defaultThumbnails} />
    </>
  );
}
