// Google Search Console에 사이트맵 업데이트 알림
export async function notifyGoogleSitemap() {
  try {
    const sitemapUrl = "https://nullisdefined.my/sitemap.xml";
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(
      sitemapUrl
    )}`;

    const response = await fetch(pingUrl, {
      method: "GET",
      headers: {
        "User-Agent": "nullisdefined-blog/1.0",
      },
    });

    if (response.ok) {
      console.log("✅ Google에 사이트맵 업데이트 알림 완료");
      return true;
    } else {
      console.warn("⚠️ Google 사이트맵 알림 실패:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ Google 사이트맵 알림 오류:", error);
    return false;
  }
}

// Bing Search Engine에 사이트맵 알림
export async function notifyBingSitemap() {
  try {
    const sitemapUrl = "https://nullisdefined.my/sitemap.xml";
    const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(
      sitemapUrl
    )}`;

    const response = await fetch(pingUrl, {
      method: "GET",
      headers: {
        "User-Agent": "nullisdefined-blog/1.0",
      },
    });

    if (response.ok) {
      console.log("✅ Bing에 사이트맵 업데이트 알림 완료");
      return true;
    } else {
      console.warn("⚠️ Bing 사이트맵 알림 실패:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ Bing 사이트맵 알림 오류:", error);
    return false;
  }
}

// 모든 검색엔진에 알림
export async function notifyAllSearchEngines() {
  console.log("🔄 검색엔진에 사이트맵 업데이트 알림 중...");

  const results = await Promise.allSettled([
    notifyGoogleSitemap(),
    notifyBingSitemap(),
  ]);

  const successCount = results.filter(
    (result) => result.status === "fulfilled" && result.value === true
  ).length;

  console.log(`✅ ${successCount}/2 검색엔진에 알림 완료`);
  return successCount;
}

// 개별 페이지 색인 요청 (Google Search Console API)
export async function requestIndexing(url: string) {
  try {
    // 실제 환경에서는 Google Search Console API 키가 필요합니다
    // 현재는 로그만 출력
    console.log(`🔍 색인 요청: ${url}`);

    // Google URL Inspection API를 사용한 실제 구현은 서버 환경에서 필요
    // 여기서는 기본적인 구조만 제공

    return true;
  } catch (error) {
    console.error("❌ 색인 요청 오류:", error);
    return false;
  }
}

// 페이지 성능 점수 계산
export function calculateSEOScore(post: {
  title: string;
  content: string;
  tags?: string[];
  thumbnail?: string;
}): {
  score: number;
  suggestions: string[];
} {
  let score = 0;
  const suggestions: string[] = [];

  // 제목 길이 체크 (30-60자 권장)
  if (post.title.length >= 30 && post.title.length <= 60) {
    score += 20;
  } else {
    suggestions.push(
      post.title.length < 30
        ? "제목이 너무 짧습니다 (30자 이상 권장)"
        : "제목이 너무 깁니다 (60자 이하 권장)"
    );
  }

  // 콘텐츠 길이 체크 (300자 이상 권장)
  if (post.content.length >= 300) {
    score += 20;
  } else {
    suggestions.push("콘텐츠가 너무 짧습니다 (300자 이상 권장)");
  }

  // 태그 개수 체크 (3-5개 권장)
  if (post.tags && post.tags.length >= 3 && post.tags.length <= 5) {
    score += 30;
  } else {
    suggestions.push("태그를 3-5개 설정하는 것이 좋습니다");
  }

  // 썸네일 이미지 체크
  if (post.thumbnail) {
    score += 15;
  } else {
    suggestions.push("썸네일 이미지를 설정하면 SNS 공유 시 효과적입니다");
  }

  // 읽기 시간 계산 (2-10분 권장)
  const readingTime = Math.ceil(post.content.split(" ").length / 200);
  if (readingTime >= 2 && readingTime <= 10) {
    score += 15;
  } else {
    suggestions.push(
      readingTime < 2
        ? "콘텐츠를 조금 더 자세히 작성해보세요"
        : "콘텐츠가 너무 길 수 있습니다. 분할을 고려해보세요"
    );
  }

  return { score, suggestions };
}

// URL 구조 최적화 검증
export function validateSEOFriendlyURL(url: string): {
  isValid: boolean;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let isValid = true;

  // URL 길이 체크 (255자 이하 권장)
  if (url.length > 255) {
    isValid = false;
    suggestions.push("URL이 너무 깁니다 (255자 이하 권장)");
  }

  // 특수문자 체크
  if (
    !/^[a-zA-Z0-9\-\/]+$/.test(
      url.replace("https://", "").replace("http://", "")
    )
  ) {
    suggestions.push("URL에 특수문자나 공백이 포함되어 있습니다");
  }

  // 하이픈 사용 권장
  if (url.includes("_")) {
    suggestions.push("언더스코어(_) 대신 하이픈(-)을 사용하는 것이 좋습니다");
  }

  // HTTPS 체크
  if (!url.startsWith("https://")) {
    isValid = false;
    suggestions.push("HTTPS를 사용해주세요");
  }

  return { isValid, suggestions };
}
