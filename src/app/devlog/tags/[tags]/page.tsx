// /src/app/devlog/tags/[tags]/page.tsx
import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { getPostsByTag, getPostList, getAllTags } from "@/lib/posts";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/devlog/post-card";

interface TagPageProps {
  params: {
    tags: string;
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tags: tag,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const decodedTag = decodeURIComponent(params.tags);
  const [taggedPosts, allPosts] = await Promise.all([
    getPostsByTag(decodedTag),
    getPostList(),
  ]);

  if (taggedPosts.length === 0) {
    notFound();
  }

  return (
    <DevlogLayout posts={allPosts}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">#{decodedTag}</h1>
          <p className="text-muted-foreground">
            {taggedPosts.length}개의 포스트를 찾았습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {taggedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </DevlogLayout>
  );
}
