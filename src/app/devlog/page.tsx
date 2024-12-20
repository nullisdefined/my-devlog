import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { PostCard } from "@/components/devlog/post-card";
import { getPostList } from "@/lib/posts";
import { Pagination } from "@/components/devlog/pagination";
import { LayoutGrid } from "lucide-react";
import { SortButton } from "@/components/devlog/sort-button";

export default async function DevlogPage({
  searchParams,
}: {
  searchParams: { page?: string; order?: "asc" | "desc" };
}) {
  const order = searchParams.order || "desc";
  const posts = (await getPostList()).sort((a, b) => {
    const comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    return order === "asc" ? comparison : -comparison;
  });

  const currentPage = Number(searchParams.page) || 1;
  const postsPerPage = 6;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <DevlogLayout posts={posts} isListPage={true}>
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

        <div className="grid grid-cols-1 gap-4">
          {currentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </DevlogLayout>
  );
}
