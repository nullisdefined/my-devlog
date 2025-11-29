import { unstable_cache } from "next/cache";
import { getAllPosts } from "./posts";
import { Post } from "@/types";

// RSS 피드 캐싱
export const getCachedRSSFeed = unstable_cache(
  async () => {
    const posts = await getAllPosts();
    return posts.slice(0, 20); // 최신 20개 포스트만
  },
  ["rss-feed"],
  {
    revalidate: 3600, // 1시간마다 재생성
    tags: ["posts"],
  },
);

// 카테고리별 RSS 캐싱
export const getCachedCategoryFeed = (category: string) =>
  unstable_cache(
    async () => {
      const posts = await getAllPosts();
      return posts.filter(
        (post) => post.category?.toLowerCase() === category.toLowerCase(),
      );
    },
    ["rss-feed-category", category],
    {
      revalidate: 3600,
      tags: ["posts", "categories"],
    },
  )();

// 태그별 RSS 캐싱
export const getCachedTagFeed = (tag: string) =>
  unstable_cache(
    async () => {
      const posts = await getAllPosts();
      return posts.filter((post) => post.tags?.includes(tag));
    },
    ["rss-feed-tag", tag],
    {
      revalidate: 3600,
      tags: ["posts", "tags"],
    },
  )();

// 시리즈별 RSS 캐싱
export const getCachedSeriesFeed = (series: string) =>
  unstable_cache(
    async () => {
      const posts = await getAllPosts();
      return posts.filter(
        (post) =>
          post.category?.includes(series) || post.tags?.includes(series),
      );
    },
    ["rss-feed-series", series],
    {
      revalidate: 3600,
      tags: ["posts", "series"],
    },
  )();

// 포스트 업데이트 시 캐시 무효화
export async function invalidateRSSCache() {
  // Next.js의 revalidateTag 사용 (서버 환경에서만 동작)
  try {
    if (typeof window === "undefined") {
      const { revalidateTag } = await import("next/cache");
      revalidateTag("posts");
      revalidateTag("categories");
      revalidateTag("tags");
      revalidateTag("series");
    }
  } catch (error) {
    console.warn("Cache revalidation failed:", error);
  }
}

// 캐시 통계 정보
export interface CacheStats {
  hitRate: number;
  totalRequests: number;
  cacheHits: number;
  lastRevalidation: Date;
}

// 간단한 캐시 통계 추적
class CacheStatsTracker {
  private stats = new Map<
    string,
    { hits: number; misses: number; lastAccess: Date }
  >();

  recordHit(key: string) {
    const stat = this.stats.get(key) || {
      hits: 0,
      misses: 0,
      lastAccess: new Date(),
    };
    stat.hits++;
    stat.lastAccess = new Date();
    this.stats.set(key, stat);
  }

  recordMiss(key: string) {
    const stat = this.stats.get(key) || {
      hits: 0,
      misses: 0,
      lastAccess: new Date(),
    };
    stat.misses++;
    stat.lastAccess = new Date();
    this.stats.set(key, stat);
  }

  getStats(key: string): CacheStats | null {
    const stat = this.stats.get(key);
    if (!stat) return null;

    const totalRequests = stat.hits + stat.misses;
    return {
      hitRate: totalRequests > 0 ? (stat.hits / totalRequests) * 100 : 0,
      totalRequests,
      cacheHits: stat.hits,
      lastRevalidation: stat.lastAccess,
    };
  }

  getAllStats() {
    const result: Record<string, CacheStats> = {};
    Array.from(this.stats.entries()).forEach(([key, stat]) => {
      const totalRequests = stat.hits + stat.misses;
      result[key] = {
        hitRate: totalRequests > 0 ? (stat.hits / totalRequests) * 100 : 0,
        totalRequests,
        cacheHits: stat.hits,
        lastRevalidation: stat.lastAccess,
      };
    });
    return result;
  }
}

export const cacheStatsTracker = new CacheStatsTracker();

// 캐시된 데이터를 가져오는 래퍼 함수
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: { revalidate?: number },
): Promise<T> {
  try {
    const data = await fetcher();
    cacheStatsTracker.recordHit(key);
    return data;
  } catch (error) {
    cacheStatsTracker.recordMiss(key);
    throw error;
  }
}
