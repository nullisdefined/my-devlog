"use client";

import { format } from "date-fns";
import { Tag } from "@/components/devlog/tag";
import { Comments } from "@/components/devlog/comments";
import { PostContent } from "@/components/devlog/post-content";
import { useToc } from "@/app/context/toc-provider";
import { useEffect } from "react";
import { Post, TableOfContentsItem } from "@/types/index";

interface PostViewProps {
  post: Post;
  content: string;
  toc: TableOfContentsItem[];
}

export function PostView({ post, content, toc }: PostViewProps) {
  const { setToc } = useToc();

  useEffect(() => {
    setToc(toc);
    return () => setToc(null);
  }, [toc, setToc]);

  return (
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
  );
}
