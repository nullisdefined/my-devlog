import { Post } from "@/types/index";

// 검색어와 텍스트 간의 매칭 점수를 계산하는 함수
const getMatchScore = (
  text: string | undefined,
  searchQuery: string
): number => {
  if (!text) return 0;

  const normalizedText = text.toLowerCase();
  const normalizedQuery = searchQuery.toLowerCase();

  // 정확한 일치
  if (normalizedText === normalizedQuery) return 100;
  // 단어 단위 일치 (스페이스로 구분된 단어가 정확히 일치)
  if (normalizedText.split(" ").includes(normalizedQuery)) return 50;
  // 부분 일치
  if (normalizedText.includes(normalizedQuery)) return 25;

  return 0;
};

export function searchPosts(posts: Post[], query: string): Post[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const searchQueries = trimmedQuery.toLowerCase().split(/\s+/);

  const scoredPosts = posts.map((post) => {
    let score = 0;

    searchQueries.forEach((searchQuery) => {
      // 제목 매칭 (최고 가중치)
      score += getMatchScore(post.title, searchQuery) * 3;

      // 발췌문 매칭 (높은 가중치)
      score += getMatchScore(post.excerpt, searchQuery) * 2;

      // 태그 매칭 (중간 가중치)
      if (post.tags) {
        const tagScore = Math.max(
          ...post.tags.map((tag) => getMatchScore(tag, searchQuery))
        );
        score += tagScore * 2;
      }

      // 카테고리 매칭 (중간 가중치)
      score += getMatchScore(post.category, searchQuery) * 2;

      // 내용 매칭 (기본 가중치)
      score += getMatchScore(post.content, searchQuery);
    });

    return {
      post,
      score,
    };
  });

  // 점수가 0보다 큰 포스트만 필터링하고 정렬
  return scoredPosts
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.post);
}
