import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { getPostBySlug } from "@/lib/posts";
import { markdownToHtml, extractTableOfContents } from "@/lib/markdown";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Tag } from "@/components/devlog/tag";
import { Comments } from "@/components/devlog/comments";

export default async function PostPage({
  params: { category, slug },
}: {
  params: { category: string; slug: string };
}) {
  const post = await getPostBySlug(category, slug);

  if (!post) {
    notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const toc = extractTableOfContents(content);

  return (
    <DevlogLayout toc={toc}>
      <article className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="space-y-1 mb-4">
            <time
              dateTime={post.date}
              className="text-sm text-muted-foreground"
            >
              {format(new Date(post.date), "yyyy년 MM월 dd일")}
            </time>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            {post.description && (
              <p className="text-xl text-muted-foreground">
                {post.description}
              </p>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Tag key={tag} name={tag} />
              ))}
            </div>
          )}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>

        <Comments />
      </article>
    </DevlogLayout>
  );
}
