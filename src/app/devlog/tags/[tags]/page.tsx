import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { getPostsByTag, getPostList, getAllTags } from "@/lib/posts";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/devlog/post-card";
import { TagIcon } from "lucide-react";
import { Post } from "@/types";
import { SortButton } from "@/components/devlog/sort-button";

interface TagPageProps {
  params: {
    tags: string;
  };
  searchParams: {
    order?: "asc" | "desc";
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();

  return tags.map((tag) => ({
    tags: tag,
  }));
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const order = searchParams.order || "desc";
  const decodedTag = decodeURIComponent(params.tags);

  const [taggedPosts, allPosts] = await Promise.all([
    getPostsByTag(decodedTag),
    getPostList(),
  ]);

  if (taggedPosts.length === 0) {
    notFound();
  }

  const sortedPosts = [...taggedPosts].sort((a, b) => {
    const comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    return order === "asc" ? comparison : -comparison;
  });

  return (
    <DevlogLayout posts={allPosts}>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <TagIcon className="w-6 h-6" />
            <h1 className="text-3xl font-bold">#{decodedTag}</h1>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {sortedPosts.length} {sortedPosts.length === 1 ? "Post" : "Posts"}{" "}
              found
            </p>
            <SortButton order={order} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sortedPosts.map((post: Post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </DevlogLayout>
  );
}
