import { Card } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import { Post } from "@/types/post";
import { Tag } from "./tag";
import Image from "next/image";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/devlog/${post.category.toLowerCase()}/${post.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full group max-w-sm">
        <div className="relative aspect-[4/3]">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-muted p-6 flex items-center justify-center">
              <p className="text-muted-foreground line-clamp-6 text-5xl font-semibold group-hover:text-gray-500 transition-colors">
                {post.description || post.content || "..."}
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/10 transition-colors" />
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="font-medium">{post.category}</span>
              <time dateTime={post.date} className="text-xs">
                {format(new Date(post.date), "yyyy.MM.dd")}
              </time>
            </div>
            <h2 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Tag key={tag} name={tag} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
