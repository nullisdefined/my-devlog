import Link from "next/link";
import { format } from "date-fns";
import { Post } from "@/types/index";
import Image from "next/image";
import { cn } from "@/lib/class-name-utils";
import { getFirstParagraph } from "@/lib/remove-markdown-utils";
import { useViewMode } from "@/app/context/view-mode-provider";
import { Tag as TagIcon } from "lucide-react";

interface PostCardProps {
  post: Post;
}

interface TagProps {
  tag: string;
  className?: string;
}

export function Tag({ tag, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        "px-2 py-1 rounded",
        "bg-secondary text-secondary-foreground",
        "hover:bg-secondary/80 transition-colors",
        "text-xs font-medium",
        className
      )}
    >
      <TagIcon className="w-3 h-3" />
      {tag}
    </span>
  );
}

// 카드형 (세로형) 컴포넌트
function CardView({ post }: PostCardProps) {
  const previewText = getFirstParagraph(post.content, 150);

  return (
    <Link
      href={`/devlog/posts/${post.urlCategory}/${post.slug}`}
      className="block"
    >
      <article className="group relative bg-card rounded-lg border border-border overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
        {/* 썸네일 영역 */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-all duration-300 ease-in-out
               group-hover:scale-105
               dark:opacity-90 dark:brightness-90
               dark:group-hover:opacity-100 dark:group-hover:brightness-100"
              sizes="(max-width: 768px) 100vw, 400px"
              priority={false}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-sky-500/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/60">
                {post.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* 컨텐츠 영역 */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {post.category && (
              <span className="text-xs tracking-wide font-semibold text-primary/90 uppercase bg-primary/10 px-2 py-1 rounded">
                {post.category}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {format(new Date(post.date), "yyyy.MM.dd")}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 leading-tight line-clamp-2 group-hover:text-emerald-500 transition-colors">
            {post.title}
          </h2>

          {previewText && (
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
              {previewText}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

// 리스트형 (가로형) 컴포넌트
function ListView({ post }: PostCardProps) {
  const previewText = getFirstParagraph(post.content, 200);

  return (
    <Link
      href={`/devlog/posts/${post.urlCategory}/${post.slug}`}
      className="block"
    >
      <article className="group relative bg-card rounded-lg border border-border overflow-hidden transition-all hover:shadow-lg hover:scale-[1.01] duration-300">
        <div className="flex flex-col sm:flex-row min-h-[180px]">
          <div className="flex-1 p-4 sm:p-5 flex flex-col order-2 sm:order-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {post.category && (
                <span className="text-xs tracking-wide font-semibold text-primary/90 uppercase bg-primary/10 px-2 py-1 rounded">
                  {post.category}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {format(new Date(post.date), "yyyy.MM.dd")}
              </span>
            </div>

            <div className="flex-grow flex flex-col">
              <h2
                className="text-lg sm:text-xl font-bold 
                           mb-2 sm:mb-3
                           leading-tight
                           line-clamp-2 
                           group-hover:text-emerald-500 transition-colors"
              >
                {post.title}
              </h2>

              {previewText && (
                <p
                  className="text-sm sm:text-base 
                             text-muted-foreground 
                             leading-relaxed
                             flex-grow
                             line-clamp-3 sm:line-clamp-4"
                >
                  {previewText}
                </p>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Masonry형 컴포넌트
function MasonryView({ post }: PostCardProps) {
  const previewText = getFirstParagraph(post.content, 180);

  return (
    <Link
      href={`/devlog/posts/${post.urlCategory}/${post.slug}`}
      className="block mb-4 md:mb-6 break-inside-avoid"
    >
      <article className="group relative bg-card rounded-lg border border-border overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
        {/* 썸네일 영역 */}
        {post.thumbnail ? (
          <div className="relative overflow-hidden">
            <Image
              src={post.thumbnail}
              alt={post.title}
              width={400}
              height={250}
              className="w-full h-auto object-cover transition-all duration-300 ease-in-out
               group-hover:scale-105
               dark:opacity-90 dark:brightness-90
               dark:group-hover:opacity-100 dark:group-hover:brightness-100"
              sizes="(max-width: 768px) 100vw, 400px"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="w-full aspect-square bg-gradient-to-br from-emerald-500/20 to-sky-500/20 flex items-center justify-center">
            <span className="text-7xl font-bold text-muted-foreground/60">
              {post.title.charAt(0)}
            </span>
          </div>
        )}

        {/* 컨텐츠 영역 */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {post.category && (
              <span className="text-xs tracking-wide font-semibold text-primary/90 uppercase bg-primary/10 px-2 py-1 rounded">
                {post.category}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {format(new Date(post.date), "yyyy.MM.dd")}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 leading-tight line-clamp-2 group-hover:text-emerald-500 transition-colors">
            {post.title}
          </h2>

          {previewText && (
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
              {previewText}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

export function PostCard({ post }: PostCardProps) {
  const { viewMode } = useViewMode();

  if (viewMode === "card") {
    return <CardView post={post} />;
  }

  if (viewMode === "masonry") {
    return <MasonryView post={post} />;
  }

  return <ListView post={post} />;
}
