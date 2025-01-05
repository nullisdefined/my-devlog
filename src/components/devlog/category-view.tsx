"use client";

import { Post } from "@/types/index";
import { PostCard } from "./post-card";
import { Pagination } from "./pagination";
import { SortButton } from "./sort-button";
import { IconMapper } from "./icon-mapper";

interface CategoryViewProps {
  posts: Post[];
  allPosts: Post[];
  currentCategory: {
    name: string;
    path: string;
    iconName: string;
    description?: string;
  };
  order: "asc" | "desc";
  categoryPosts: Post[];
  currentPage: number;
  totalPages: number;
}

export function CategoryView({
  posts,
  allPosts,
  currentCategory,
  order,
  categoryPosts,
  currentPage,
  totalPages,
}: CategoryViewProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <IconMapper name={currentCategory.iconName} className="w-6 h-6" />
          <h1 className="text-3xl font-bold">{currentCategory.name}</h1>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {categoryPosts.length}{" "}
            {categoryPosts.length === 1 ? "Post" : "Posts"} found
          </p>
          <SortButton order={order} />
        </div>
      </div>

      {categoryPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post: Post) => (
              <PostCard key={`${post.urlCategory}/${post.slug}`} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          )}
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No posts in this category yet.
        </div>
      )}
    </div>
  );
}
