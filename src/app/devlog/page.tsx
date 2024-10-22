import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { PostCard } from "@/components/devlog/post-card";
import { getPostList } from "@/lib/posts";
import { Pagination } from "@/components/devlog/pagination";

export default async function DevlogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const posts = await getPostList();
  const currentPage = Number(searchParams.page) || 1;
  const postsPerPage = 6;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // 현재 페이지의 포스트만 가져오기
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <DevlogLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">All Posts</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-8 justify-items-center">
          {currentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </DevlogLayout>
  );
}
