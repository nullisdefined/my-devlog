"use client";
import { format } from "date-fns";
import { Comments } from "@/components/devlog/comments";
import { PostContent } from "@/components/devlog/post-content";
import { Post, TableOfContentsItem } from "@/types/index";
import { Calendar, Tag as TagIcon } from "lucide-react";
import { cn } from "@/lib/class-name-utils";
import { DynamicBanner } from "./dynamic-banner";
import { TocInitializer } from "./toc-initializer";

interface PostViewProps {
  post: Post;
  content: string;
  toc: TableOfContentsItem[];
}

// 포스트 상세 페이지용 태그 컴포넌트
function Tag({ tag, className }: { tag: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "px-3 py-1.5 rounded-full",
        "bg-secondary text-secondary-foreground",
        "hover:bg-secondary/80 transition-colors",
        "text-sm font-medium",
        className
      )}
    >
      <TagIcon className="w-3.5 h-3.5" />
      {tag}
    </span>
  );
}

export function PostView({ post, content, toc }: PostViewProps) {
  return (
    <>
      {/* TOC 초기화 */}
      <TocInitializer toc={toc} />

      {/* 동적 그라디언트 배너 */}
      {post.thumbnail && <DynamicBanner thumbnail={post.thumbnail} />}

      <article className="max-w-4xl mx-auto text-left px-4 sm:px-6">
        {/* 타이틀 헤더 - 배너 밖에 위치, 간격 조정 */}
        <header className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border/20">
          <div className="space-y-3 sm:space-y-4">
            {/* 카테고리 */}
            {post.category && (
              <div className="inline-block">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider bg-secondary px-3 py-1.5 rounded-full border">
                  {post.category}
                </span>
              </div>
            )}

            {/* 제목 */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
              {post.title}
            </h1>

            {/* 메타 정보 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>
                  {format(new Date(post.date), "yyyy년 MM월 dd일")}
                </time>
              </div>
            </div>
          </div>
        </header>

        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            {post.tags.map((tag: string) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* 본문 */}
        <div className="prose prose-base dark:prose-invert max-w-none">
          <PostContent content={content} />
        </div>

        {/* 댓글 */}
        <Comments />
      </article>
    </>
  );
}
