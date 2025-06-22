import { LayoutGrid } from "lucide-react";
import { SortButton } from "@/components/devlog/sort-button";
import { ViewModeToggle } from "@/components/devlog/view-mode-toggle";
import { getAllPosts } from "@/lib/posts";
import { InfiniteScrollPosts } from "@/components/devlog/infinite-scroll-posts";
import { RSSStructuredData } from "@/components/devlog/rss-structured-data";

export default async function DevlogPage({
  searchParams,
}: {
  searchParams: { order?: "asc" | "desc" };
}) {
  const order = searchParams.order || "desc";
  const posts = await getAllPosts();

  const sortedPosts = [...posts].sort((a, b) => {
    const comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    return order === "asc" ? comparison : -comparison;
  });

  return (
    <>
      <RSSStructuredData posts={sortedPosts} feedType="main" />
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
            <div className="flex items-center gap-3">
              <ViewModeToggle />
              <SortButton order={order} />
            </div>
          </div>
        </div>

        <InfiniteScrollPosts
          initialPosts={sortedPosts.slice(0, 8)}
          allPosts={sortedPosts}
          order={order}
        />
      </div>
    </>
  );
}
