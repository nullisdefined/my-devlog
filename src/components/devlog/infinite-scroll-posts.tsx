"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { Post } from "@/types";
import { PostCard } from "./post-card";
import { PopcatCard } from "./popcat-card";
import { useViewMode } from "@/app/context/view-mode-provider";

interface InfiniteScrollPostsProps {
  initialPosts: Post[];
  allPosts: Post[];
  order: "asc" | "desc";
}

export function InfiniteScrollPosts({
  initialPosts,
  allPosts,
  order,
}: InfiniteScrollPostsProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialPosts.length < allPosts.length);
  const [isLoading, setIsLoading] = useState(false);
  const { viewMode } = useViewMode();
  const postsPerPage = 8;

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setIsLoading(true);

      setTimeout(() => {
        const nextPosts = allPosts.slice(0, posts.length + postsPerPage);
        setPosts(nextPosts);

        if (nextPosts.length === allPosts.length) {
          setHasMore(false);
        }
        setIsLoading(false);
      }, 500);
    }
  }, [inView, hasMore, posts.length, allPosts, isLoading]);

  const getGridClassName = () => {
    switch (viewMode) {
      case "masonry":
        return "columns-1 md:columns-2 xl:columns-3 gap-4 space-y-0";
      case "card":
        return "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4";
      case "list":
        return "grid grid-cols-1 gap-2";
      default:
        return "columns-1 md:columns-2 xl:columns-3 gap-4 space-y-0";
    }
  };

  // Masonry 레이아웃에서 row-major 방식으로 컬럼 분배 함수 추가
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

  // Masonry 레이아웃에서 팝캣을 확률적으로 끼워넣는 함수
  const renderMasonryContent = () => {
    if (viewMode !== "masonry") {
      return posts.map((post) => <PostCard key={post.slug} post={post} />);
    }

    // 반응형 컬럼 수 계산 (Tailwind 기준)
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
        <PopcatCard key={`popcat-masonry`} variant={popcatVariant} />
      );
    }

    return (
      <div className="flex gap-4">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col gap-0">
            {col.map((item, idx) => {
              if (React.isValidElement(item)) {
                return React.cloneElement(item, { key: item.key ?? idx });
              }
              return (
                <PostCard key={(item as Post).slug + idx} post={item as Post} />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {viewMode === "card" ? (
        <div className={getGridClassName()}>{renderMasonryContent()}</div>
      ) : (
        <div>{renderMasonryContent()}</div>
      )}

      {(hasMore || isLoading) && (
        <div ref={ref} className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent opacity-50" />
        </div>
      )}
    </div>
  );
}
