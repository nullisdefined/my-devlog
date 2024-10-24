import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { getPostBySlug, getPostList } from "@/lib/posts";
import { markdownToHtml, extractTableOfContents } from "@/lib/markdown";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Tag } from "@/components/devlog/tag";
import { Comments } from "@/components/devlog/comments";
import { PostContent } from "@/components/devlog/post-content";

export default async function PostPage({
  params: { category, slug },
}: {
  params: { category: string; slug: string };
}) {
  const [post, posts] = await Promise.all([
    getPostBySlug(category, slug),
    getPostList(), // 모든 포스트 가져오기
  ]);

  if (!post) {
    notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <DevlogLayout
      toc={extractTableOfContents(content)}
      posts={posts} // posts prop 전달
    >
      <article className="max-w-3xl mx-auto text-left">
        <div className="mb-8">
          <div className="space-y-1 mb-4">
            <time
              dateTime={post.date}
              className="text-sm text-muted-foreground"
            >
              {format(new Date(post.date), "yyyy년 MM월 dd일")}
            </time>
            <h1 className="text-3xl font-bold text-left">{post.title}</h1>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Tag key={tag} name={tag} />
              ))}
            </div>
          )}
        </div>

        <PostContent content={content} />
        <Comments />
      </article>
    </DevlogLayout>
  );
}
