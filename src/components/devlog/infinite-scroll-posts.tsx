"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { Post } from "@/types";
import { PostCard } from "./post-card";
import { Separator } from "@/components/ui/separator";

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
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const postsPerPage = 6;

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    const sortedPosts = [...allPosts].sort((a, b) => {
      const comparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      return order === "asc" ? comparison : -comparison;
    });
    setPosts(sortedPosts.slice(0, postsPerPage));
    setPage(1);
    setHasMore(postsPerPage < sortedPosts.length);
  }, [order, allPosts]);

  useEffect(() => {
    const loadMorePosts = async () => {
      if (inView && hasMore && !isLoading) {
        setIsLoading(true);

        // 로딩 상태를 잠시 보여주기 위해 인위적인 딜레이 추가
        await new Promise((resolve) => setTimeout(resolve, 500));

        const sortedPosts = [...allPosts].sort((a, b) => {
          const comparison =
            new Date(a.date).getTime() - new Date(b.date).getTime();
          return order === "asc" ? comparison : -comparison;
        });

        const nextPosts = sortedPosts.slice(0, (page + 1) * postsPerPage);
        setPosts(nextPosts);
        setPage((prev) => prev + 1);

        if (nextPosts.length === sortedPosts.length) {
          setHasMore(false);
        }

        setIsLoading(false);
      }
    };

    loadMorePosts();
  }, [inView, hasMore, page, allPosts, order, isLoading]);

  // 페이지 단위로 포스트 그룹화
  const postPages = [];
  for (let i = 0; i < posts.length; i += postsPerPage) {
    postPages.push(posts.slice(i, i + postsPerPage));
  }

  return (
    <div className="space-y-12">
      {postPages.map((pageGroup, pageIndex) => (
        <div key={pageIndex} className="space-y-8">
          {pageIndex > 0 && (
            <div className="flex items-center gap-4">
              <Separator />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Page {pageIndex + 1}
              </span>
              <Separator />
            </div>
          )}
          <div className="grid grid-cols-1 gap-4">
            {pageGroup.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      ))}

      {hasMore && (
        <div ref={ref} className="flex flex-col items-center py-8 space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading more posts...</p>
        </div>
      )}
    </div>
  );
}
