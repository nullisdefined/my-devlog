"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { Post } from "@/types";
import { PostCard } from "./post-card";

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
  const postsPerPage = 6;

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {(hasMore || isLoading) && (
        <div ref={ref} className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent opacity-50" />
        </div>
      )}
    </div>
  );
}
