import Link from "next/link";
import { format } from "date-fns";
import { Post } from "@/types/index";
import Image from "next/image";
import { cn } from "@/lib/class-name-utils";
import { getFirstParagraph } from "@/lib/remove-markdown-utils";

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
        "inline-flex items-center",
        "px-2 py-0.5 rounded-full",
        "bg-secondary text-secondary-foreground",
        "hover:bg-secondary/80 transition-colors",
        className
      )}
    >
      #{tag}
    </span>
  );
}

export function PostCard({ post }: PostCardProps) {
  const previewText = getFirstParagraph(post.content, 350);

  return (
    <Link
      href={`/devlog/posts/${post.urlCategory}/${post.slug}`}
      className="block"
    >
      <article className="group relative bg-card rounded-lg border border-border overflow-hidden transition-all hover:shadow-lg">
        <div className="flex flex-col sm:flex-row h-full">
          <div className="flex-1 p-4 sm:p-5 flex flex-col order-2 sm:order-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {post.category && (
                <span className="text-xs sm:text-sm tracking-wide font-medium text-primary/90 uppercase">
                  {post.category}
                </span>
              )}
              <span className="text-[11px] sm:text-xs text-muted-foreground">
                {format(new Date(post.date), "yyyy.MM.dd")}
              </span>
            </div>

            <div className="flex-grow flex flex-col">
              <h2
                className="text-base sm:text-xl font-bold 
                           mb-2 sm:mb-3
                           leading-snug
                           line-clamp-2 
                           group-hover:text-emerald-500 transition-colors"
              >
                {post.title}
              </h2>

              <p
                className="text-sm sm:text-base 
                           text-muted-foreground 
                           leading-relaxed
                           flex-grow
                           line-clamp-3 sm:line-clamp-4"
              >
                {previewText.endsWith("...")
                  ? previewText
                  : `${previewText}...`}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t flex flex-wrap gap-1.5 sm:gap-2">
              {post.tags?.map((tag) => (
                <Tag key={tag} tag={tag} className="text-[11px] sm:text-xs" />
              ))}
            </div>
          </div>
          <div className="relative sm:w-[280px] shrink-0 order-1 sm:order-2">
            {post.thumbnail ? (
              <div className="relative aspect-[16/9] sm:aspect-square group">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-contain transition-all duration-500 ease-in-out
                   dark:opacity-90 dark:brightness-78 dark:contrast-100
                   dark:group-hover:opacity-100 dark:group-hover:brightness-100 dark:group-hover:contrast-100"
                  sizes="(max-width: 768px) 100vw, 280px"
                  priority={false}
                />
              </div>
            ) : (
              <div className="relative aspect-[16/9] sm:aspect-square bg-gradient-to-br from-emerald-500/30 to-sky-500/30 flex items-center justify-center">
                <span className="text-5xl sm:text-7xl font-bold text-muted-foreground/60 dark:text-card-foreground">
                  {post.title.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
