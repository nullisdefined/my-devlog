const allPosts: Post[] = [];

import { Post } from "@/types/index";

export function getTagStats() {
  const stats = new Map<string, number>();

  allPosts.forEach((post: Post) => {
    post.tags?.forEach((tag: string) => {
      stats.set(tag, (stats.get(tag) || 0) + 1);
    });
  });

  return Array.from(stats.entries()).sort((a, b) => b[1] - a[1]);
}

export function getRelatedTags(tag: string) {
  const related = new Map<string, number>();

  allPosts
    .filter((post: Post) => post.tags?.includes(tag))
    .forEach((post: Post) => {
      post.tags?.forEach((t: string) => {
        if (t !== tag) {
          related.set(t, (related.get(t) || 0) + 1);
        }
      });
    });

  return Array.from(related.entries()).sort((a, b) => b[1] - a[1]);
}
