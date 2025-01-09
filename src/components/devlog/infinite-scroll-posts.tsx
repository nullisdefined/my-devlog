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
  const postsPerPage = 6;

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && hasMore) {
      const nextPosts = allPosts.slice(0, (page + 1) * postsPerPage);
      setPosts(nextPosts);
      setPage((prev) => prev + 1);

      if (nextPosts.length === allPosts.length) {
        setHasMore(false);
      }
    }
  }, [inView, hasMore, page, allPosts]);

  // 페이지 단위로 포스트 그룹화
  const postPages = [];
  for (let i = 0; i < posts.length; i += postsPerPage) {
    postPages.push(posts.slice(i, i + postsPerPage));
  }

  return (
    <div className="space-y-12">
      {postPages.map((pageGroup, pageIndex) => (
        <div key={pageIndex} className="space-y-8">
          <div className="flex items-center gap-4">
            <Separator />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Page {pageIndex + 1}
            </span>
            <Separator />
          </div>
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
