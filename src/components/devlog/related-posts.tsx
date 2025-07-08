"use client";

import Link from "next/link";
import { Post } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";

interface RelatedPostsProps {
  currentPost: Post;
  allPosts: Post[];
  maxPosts?: number;
}

export function RelatedPosts({
  currentPost,
  allPosts,
  maxPosts = 4,
}: RelatedPostsProps) {
  // 관련도 점수 계산 함수
  const calculateRelevanceScore = (post: Post): number => {
    let score = 0;

    // 같은 카테고리면 높은 점수
    if (post.category === currentPost.category) {
      score += 3;
    }

    // 공통 태그 개수에 따른 점수
    const commonTags =
      post.tags?.filter((tag) => currentPost.tags?.includes(tag)) || [];
    score += commonTags.length * 2;

    // 제목에 공통 키워드가 있으면 점수 추가
    const currentTitleWords = currentPost.title.toLowerCase().split(" ");
    const postTitleWords = post.title.toLowerCase().split(" ");
    const commonWords = currentTitleWords.filter(
      (word) => postTitleWords.includes(word) && word.length > 2
    );
    score += commonWords.length;

    return score;
  };

  // 관련 포스트 찾기
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentPost.slug) // 현재 포스트 제외
    .map((post) => ({
      ...post,
      relevanceScore: calculateRelevanceScore(post),
    }))
    .filter((post) => post.relevanceScore > 0) // 관련도가 있는 포스트만
    .sort((a, b) => b.relevanceScore - a.relevanceScore) // 관련도 순 정렬
    .slice(0, maxPosts);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6">관련 포스트</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {relatedPosts.map((post) => (
          <Link
            key={`${post.urlCategory}/${post.slug}`}
            href={`/devlog/posts/${post.urlCategory}/${post.slug}`}
            className="group block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            <article>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {post.content?.substring(0, 100)}...
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("ko-KR")}
                  </time>
                </div>

                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
