import { LayoutGrid } from "lucide-react";
import { SortButton } from "@/components/devlog/sort-button";
import { getPostList } from "@/lib/posts";
import { InfiniteScrollPosts } from "@/components/devlog/infinite-scroll-posts";

export default async function DevlogPage({
  searchParams,
}: {
  searchParams: { order?: "asc" | "desc" };
}) {
  const order = searchParams.order || "desc";
  const posts = await getPostList();

  const sortedPosts = [...posts].sort((a, b) => {
    const comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    return order === "asc" ? comparison : -comparison;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutGrid className="w-6 h-6" />
          All Posts
        </h1>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {posts.length} {posts.length === 1 ? "Post" : "Posts"} found
          </p>
          <SortButton order={order} />
        </div>
      </div>

      <InfiniteScrollPosts
        initialPosts={sortedPosts.slice(0, 6)}
        allPosts={sortedPosts}
        order={order}
      />
    </div>
  );
}
