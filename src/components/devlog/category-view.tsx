"use client";

import { Post } from "@/types/index";
import { PostCard } from "./post-card";
import { PopcatCard } from "./popcat-card";
import { Pagination } from "./pagination";
import { SortButton } from "./sort-button";
import { ViewModeToggle } from "./view-mode-toggle";
import { IconMapper } from "./icon-mapper";
import { useViewMode } from "@/app/context/view-mode-provider";

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

  // Masonry 레이아웃에서 팝캣을 확률적으로 끼워넣는 함수
  const renderMasonryContent = () => {
    if (viewMode !== "masonry") {
      return posts.map((post: Post) => (
        <PostCard key={`${post.urlCategory}/${post.slug}`} post={post} />
      ));
    }

    const content: React.ReactNode[] = [];

    // 페이지당 3% 확률로 팝캣 1개 추가 (페이지 시작 부분에)
    if (Math.random() < 0.03) {
      const popcatVariant = (Math.random() < 0.5 ? 1 : 2) as 1 | 2;
      content.push(
        <PopcatCard
          key={`popcat-page-${currentPage}`}
          variant={popcatVariant}
        />
      );
    }

    posts.forEach((post) => {
      // 포스트 추가
      content.push(
        <PostCard key={`${post.urlCategory}/${post.slug}`} post={post} />
      );
    });

    return content;
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
          <div className={getGridClassName()}>{renderMasonryContent()}</div>

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
