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

  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <DevlogLayout>
      {currentPage === 1 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-6">All Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-8 justify-items-center">
          {currentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </section>
    </DevlogLayout>
  );
}
