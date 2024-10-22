// src/app/devlog/[category]/[slug]/page.tsx
import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Tag } from "@/components/devlog/tag";

export default async function PostPage({
  params: { category, slug },
}: {
  params: { category: string; slug: string };
}) {
  const post = await getPostBySlug(category, slug);

  if (!post) {
    notFound();
  }

  return (
    <DevlogLayout>
      <article className="max-w-3xl mx-auto">
        {/* Post Header */}
        <div className="mb-8">
          <div className="space-y-1 mb-4">
            <time
              dateTime={post.date}
              className="text-sm text-muted-foreground"
            >
              {format(new Date(post.date), "yyyy년 MM월 dd일")}
            </time>
            <h1 className="text-3xl font-bold">{post.title}</h1>
          </div>

          {post.tags && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Tag key={tag} name={tag} />
              ))}
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="prose dark:prose-invert max-w-none">
          {post.content && (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          )}
        </div>
      </article>
    </DevlogLayout>
  );
}
