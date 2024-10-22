// src/app/blog/[category]/[slug]/page.tsx
import { notFound } from "next/navigation";
import { format } from "date-fns";

interface PostParams {
  params: {
    category: string;
    slug: string;
  };
}

// 이 부분은 나중에 실제 데이터로 대체됩니다
const getPost = async (slug: string) => {
  // 실제로는 데이터베이스나 CMS에서 가져올 것입니다
  return {
    title: "NestJS와 함께하는 마이크로서비스 아키텍처",
    content: "...",
    date: "2024-03-15",
    category: "Backend",
    author: "Jaewoo Kim",
    readingTime: "8 min read",
  };
};

export default async function PostPage({ params }: PostParams) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Post Header */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="text-sm text-muted-foreground mb-4">
              {format(new Date(post.date), "MMMM d, yyyy")} • {post.readingTime}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground">By {post.author}</div>
              <div className="text-primary">{post.category}</div>
            </div>
          </div>

          {/* Post Content */}
          <div className="prose dark:prose-invert max-w-none">
            {post.content}
          </div>
        </div>
      </div>
    </article>
  );
}
