import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { getPostBySlug, getPostList } from "@/lib/posts";
import { markdownToHtml, extractTableOfContents } from "@/lib/markdown";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Tag } from "@/components/devlog/tag";
import { Comments } from "@/components/devlog/comments";
import { PostContent } from "@/components/devlog/post-content";

interface PostPageProps {
  params: {
    slug: string[];
  };
  searchParams: {
    page?: string;
    order?: "asc" | "desc";
  };
}

export async function generateStaticParams() {
  const posts = await getPostList();

  return posts.map((post) => ({
    slug: [...(post.urlCategory?.split("/").filter(Boolean) || []), post.slug],
  }));
}

export default async function PostPage({
  params,
  searchParams,
}: PostPageProps) {
  // URL에서 마지막 부분이 실제 slug, 나머지는 카테고리 경로
  const slug = params.slug[params.slug.length - 1];
  const category = params.slug.slice(0, -1).join("/");

  const [post, posts] = await Promise.all([
    getPostBySlug(category.toLowerCase(), slug),
    getPostList(),
  ]);

  if (!post) {
    notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const order = searchParams.order || "desc";

  return (
    <DevlogLayout toc={extractTableOfContents(content)} posts={posts}>
      <article className="max-w-3xl mx-auto text-left">
        <div className="mb-8">
          <div className="space-y-1 mb-4">
            <div className="flex items-center justify-between">
              <time
                dateTime={post.date}
                className="text-sm text-muted-foreground"
              >
                {format(new Date(post.date), "yyyy년 MM월 dd일")}
              </time>
            </div>
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
