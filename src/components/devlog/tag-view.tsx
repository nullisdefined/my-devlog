"use client";

import { Post } from "@/types";
import { PostCard } from "./post-card";
import { TagIcon } from "lucide-react";
import { SortButton } from "./sort-button";

interface TagViewProps {
  sortedPosts: Post[];
  decodedTag: string;
  order: "asc" | "desc";
}

export function TagView({ sortedPosts, decodedTag, order }: TagViewProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <TagIcon className="w-6 h-6" />
          <h1 className="text-3xl font-bold">#{decodedTag}</h1>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {sortedPosts.length} {sortedPosts.length === 1 ? "Post" : "Posts"}{" "}
            found
          </p>
          <SortButton order={order} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sortedPosts.map((post: Post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
