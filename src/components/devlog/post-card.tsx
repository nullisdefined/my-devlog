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
  const category = post.category.toLowerCase();

  return (
    <Link href={`/devlog/${category}/${post.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full group w-full">
        <div className="flex justify-between p-6 gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{post.category}</span>
              <span>•</span>
              <time dateTime={post.date}>
                {format(new Date(post.date), "yyyy.MM.dd")}
              </time>
            </div>

            <h2 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {post.title}
            </h2>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.description}
            </p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Tag key={tag} name={tag} className="text-xs" />
                ))}
              </div>
            )}
          </div>

          <div className="relative w-32 h-32 flex-shrink-0">
            {post.thumbnail ? (
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={128}
                height={128}
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                <p className="text-4xl font-semibold text-muted-foreground">
                  {post.title.charAt(0)}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
