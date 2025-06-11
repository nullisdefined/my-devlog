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
      return posts.map((post) => <PostCard key={post.slug} post={post} />);
    }

    const content: React.ReactNode[] = [];
    let popcatCounter = 0;

    posts.forEach((post, index) => {
      // 포스트 추가
      content.push(<PostCard key={post.slug} post={post} />);

      // 새로운 페이지가 로드되는 시점에서만 확률적으로 팝캣 추가
      // postsPerPage(8)의 배수 위치에서 3% 확률로 팝캣 등장
      if ((index + 1) % postsPerPage === 0 && Math.random() < 0.03) {
        const popcatVariant = ((popcatCounter % 2) + 1) as 1 | 2;
        content.push(
          <PopcatCard
            key={`popcat-${popcatCounter}-${index}`}
            variant={popcatVariant}
          />
        );
        popcatCounter++;
      }
    });

    return content;
  };

  return (
    <div className="space-y-4">
      <div className={getGridClassName()}>{renderMasonryContent()}</div>

      {(hasMore || isLoading) && (
        <div ref={ref} className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent opacity-50" />
        </div>
      )}
    </div>
  );
}
