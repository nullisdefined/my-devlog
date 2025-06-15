"use client";

import { Post } from "@/types/index";
import { PostCard } from "./post-card";
import { PopcatCard } from "./popcat-card";
import { Pagination } from "./pagination";
import { SortButton } from "./sort-button";
import { ViewModeToggle } from "./view-mode-toggle";
import { IconMapper } from "./icon-mapper";
import { useViewMode } from "@/app/context/view-mode-provider";
import React from "react";

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

function splitPostsToColumns(
  posts: (Post | React.ReactElement)[],
  columnCount: number
): Array<Post | React.ReactElement>[] {
  const columns: Array<Post | React.ReactElement>[] = Array.from(
    { length: columnCount },
    () => []
  );
  posts.forEach((post, idx) => {
    columns[idx % columnCount].push(post);
  });
  return columns;
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
  const { viewMode } = useViewMode();

  const getGridClassName = () => {
    switch (viewMode) {
      case "masonry":
        return "columns-1 md:columns-2 xl:columns-3 gap-4 space-y-0";
      case "card":
        return "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4";
      case "list":
        return "grid grid-cols-1 gap-3";
      default:
        return "columns-1 md:columns-2 xl:columns-3 gap-4 space-y-0";
    }
  };

  const renderMasonryContent = () => {
    if (viewMode !== "masonry") {
      return posts.map((post: Post) => (
        <PostCard key={`${post.urlCategory}/${post.slug}`} post={post} />
      ));
    }

    let columnCount = 1;
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) columnCount = 3;
      else if (window.innerWidth >= 768) columnCount = 2;
    }
    const columns = splitPostsToColumns(posts, columnCount);

    // 팝캣은 첫번째 컬럼 맨 앞에만 확률적으로 추가
    if (Math.random() < 0.03) {
      const popcatVariant = (Math.random() < 0.5 ? 1 : 2) as 1 | 2;
      columns[0].unshift(
        <PopcatCard key={`popcat-category`} variant={popcatVariant} />
      );
    }

    return (
      <div className="flex gap-4">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col gap-4">
            {col.map((item, idx) => {
              if (React.isValidElement(item)) {
                return React.cloneElement(item, { key: item.key ?? idx });
              }
              return (
                <PostCard
                  key={
                    ((item as Post).urlCategory || "") +
                    ((item as Post).slug || idx)
                  }
                  post={item as Post}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

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
          <div className="flex items-center gap-3">
            <ViewModeToggle />
            <SortButton order={order} />
          </div>
        </div>
      </div>

      {categoryPosts.length > 0 ? (
        <>
          <div>{renderMasonryContent()}</div>

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
