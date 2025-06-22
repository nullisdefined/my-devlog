---
title: "RSS 피드 구현"
slug: "rss-feed-implementation"
date: 2025-06-17
tags: ["Devlog", "SEO", "RSS"]
category: "Series/devlog"
draft: false
views: 0
---
Next.js 13의 App Router를 활용해 동적 RSS 피드를 구현한 과정이다.

## RSS 구현의 필요성

RSS(Really Simple Syndication)는 웹사이트의 콘텐츠를 구조화된 형식으로 제공하는 표준이다. 독자들은 RSS 리더를 통해 여러 사이트의 새 글을 한 곳에서 확인할 수 있고, 개발자에게는 콘텐츠 배포를 자동화할 수 있는 수단이 된다.

## 기본 RSS 피드 구현

### 1. 필요한 패키지 설치

먼저 RSS 피드 생성을 위한 라이브러리를 설치한다.

```bash
npm install rss
npm install @types/rss --save-dev
```

### 2. Route Handler로 RSS 엔드포인트 생성

Next.js 13의 Route Handler를 활용해 `/feed.xml` 경로에서 RSS 피드를 제공한다.

```ts title:lib/rss-utils.ts
import { getAllPosts } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await getAllPosts();
  const siteUrl = "https://nullisdefined.site";
  const feedUrl = `${siteUrl}/feed.xml`;

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>개발새발</title>
    <description>소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그</description>
    <link>${siteUrl}/devlog</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
    <webMaster>nullisdefined@gmail.com (nullisdefined)</webMaster>
    <managingEditor>nullisdefined@gmail.com (nullisdefined)</managingEditor>
    <image>
      <url>${siteUrl}/favicon.ico</url>
      <title>개발새발</title>
      <link>${siteUrl}/devlog</link>
    </image>
    ${posts
      .slice(0, 20) // 최신 20개 포스트만
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <link>${siteUrl}/devlog/posts/${post.urlCategory}/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/devlog/posts/${post.urlCategory}/${
          post.slug
        }</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>nullisdefined@gmail.com (nullisdefined)</author>
      <category><![CDATA[${post.category}]]></category>
      ${post.tags
        ?.map((tag) => `<category><![CDATA[${tag}]]></category>`)
        .join("")}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
```

이 코드는 XML 문자열을 직접 생성하는 방식이다. `CDATA` 섹션을 사용해 HTML이나 특수문자가 포함된 콘텐츠를 안전하게 처리할 수 있다.

## RSS 기능 구현

### 1. RSS 유틸리티 함수

```ts title:lib/rss-utils.ts
import { marked } from "marked";
import RSS from "rss";
import { Post } from "@/types";

// 마크다운을 완전한 HTML로 변환
export function markdownToHtml(markdown: string): string {
  // marked 라이브러리로 마크다운 파싱
  const html = marked(markdown, {
    breaks: true,
    gfm: true, // GitHub Flavored Markdown
  });
  
  // 이미지 경로를 절대 경로로 변환
  return html.replace(
    /src="(?!https?:\/\/)([^"]*?)"/g,
    'src="https://nullisdefined.site$1"'
  );
}

// 텍스트에서 이미지 추출
export function extractImages(content: string): string[] {
  const imageRegex = /!\[([^\]]*)\]\(([^\)]*)\)/g;
  const images: string[] = [];
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const imageSrc = match[2];
    if (imageSrc.startsWith("http")) {
      images.push(imageSrc);
    } else {
      images.push(`https://nullisdefined.site${imageSrc}`);
    }
  }
  
  return images;
}

// 카테고리별 RSS 피드 생성
export function generateCategoryFeed(category: string, posts: Post[]): RSS {
  const categoryPosts = posts.filter(post => 
    post.category.toLowerCase() === category.toLowerCase()
  );

  const feed = new RSS({
    title: `nullisdefined - ${category} 카테고리`,
    description: `${category} 관련 글들`,
    site_url: "https://nullisdefined.site",
    feed_url: `https://nullisdefined.site/feed/category/${category.toLowerCase()}.xml`,
    language: "ko",
    pubDate: new Date().toUTCString(),
    ttl: 60,
  });

  categoryPosts.forEach(post => {
    feed.item({
      title: post.title,
      description: post.excerpt || post.title,
      url: `https://nullisdefined.site/devlog/posts/${post.urlCategory}/${post.slug}`,
      guid: `https://nullisdefined.site/devlog/posts/${post.urlCategory}/${post.slug}`,
      categories: [post.category, ...post.tags],
      date: new Date(post.date),
      author: "nullisdefined",
    });
  });

  return feed;
}

// 태그별 RSS 피드 생성  
export function generateTagFeed(tag: string, posts: Post[]): RSS {
  const tagPosts = posts.filter(post => 
    post.tags.includes(tag)
  );

  const feed = new RSS({
    title: `nullisdefined - ${tag} 태그`,
    description: `${tag} 태그가 포함된 글들`,
    site_url: "https://nullisdefined.site",
    feed_url: `https://nullisdefined.site/feed/tags/${encodeURIComponent(tag)}.xml`,
    language: "ko",
    pubDate: new Date().toUTCString(),
    ttl: 60,
  });

  tagPosts.forEach(post => {
    feed.item({
      title: post.title,
      description: post.excerpt || post.title,
      url: `https://nullisdefined.site/devlog/posts/${post.urlCategory}/${post.slug}`,
      guid: `https://nullisdefined.site/devlog/posts/${post.urlCategory}/${post.slug}`,
      categories: [post.category, ...post.tags],
      date: new Date(post.date),
      author: "nullisdefined",
    });
  });

  return feed;
}
```

### 2. 다중 RSS 피드 지원

카테고리별, 태그별로 세분화된 RSS 피드를 제공한다.

```ts title:app/feed/[...params]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { generateCategoryFeed, generateTagFeed } from "@/lib/rss-utils";

interface Props {
  params: { params: string[] };
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const posts = await getAllPosts();
    const [type, identifier] = params.params;

    let feed;

    switch (type) {
      case "category":
        if (!identifier) {
          return new NextResponse("Category not specified", { status: 400 });
        }
        feed = generateCategoryFeed(identifier, posts);
        break;
        
      case "tags":
        if (!identifier) {
          return new NextResponse("Tag not specified", { status: 400 });
        }
        const decodedTag = decodeURIComponent(identifier);
        feed = generateTagFeed(decodedTag, posts);
        break;
        
      default:
        return new NextResponse("Invalid feed type", { status: 400 });
    }

    const xml = feed.xml({ indent: true });
    
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("RSS Feed Generation Error:", error);
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}

// 동적 라우트를 위한 설정
export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  // 모든 카테고리 추출
  const categories = [...new Set(posts.map(post => post.category))];
  const categoryParams = categories.map(category => ({
    params: ["category", category.toLowerCase()]
  }));
  
  // 모든 태그 추출
  const allTags = [...new Set(posts.flatMap(post => post.tags))];
  const tagParams = allTags.map(tag => ({
    params: ["tags", encodeURIComponent(tag)]
  }));
  
  return [...categoryParams, ...tagParams];
}
```

## RSS 피드 최적화

### 1. 캐싱 전략

RSS 피드는 자주 변경되지 않으므로 적절한 캐싱이 필요하다.

```ts title:lib/cache.ts
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
    tags: ["posts"]
  }
);

// 카테고리별 RSS 캐싱
export const getCachedCategoryFeed = unstable_cache(
  async (category: string) => {
    const posts = await getAllPosts();
    return posts.filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    );
  },
  ["rss-feed-category"],
  {
    revalidate: 3600,
    tags: ["posts", "categories"]
  }
);

// 태그별 RSS 캐싱
export const getCachedTagFeed = unstable_cache(
  async (tag: string) => {
    const posts = await getAllPosts();
    return posts.filter(post => post.tags.includes(tag));
  },
  ["rss-feed-tag"],
  {
    revalidate: 3600,
    tags: ["posts", "tags"]
  }
);

// 포스트 업데이트 시 캐시 무효화
export async function invalidateRSSCache() {
  // Next.js 14+에서 사용 가능
  // revalidateTag("posts");
  
  // 또는 수동으로 캐시 클리어
  const cache = await caches.open("rss-cache");
  await cache.delete("/feed.xml");
}
```

### 2. RSS 검증 및 에러 처리

생성된 RSS 피드가 올바른 형식인지 검증한다.

```ts title:lib/rss-validator.ts
import { parseString } from "xml2js";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validateRSSFeed(xmlContent: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  return new Promise((resolve) => {
    parseString(xmlContent, (err, parsed) => {
      if (err) {
        result.isValid = false;
        result.errors.push(`XML 파싱 에러: ${err.message}`);
        resolve(result);
        return;
      }

      // RSS 구조 검증
      if (!parsed?.rss) {
        result.isValid = false;
        result.errors.push("RSS 루트 요소가 없습니다");
        resolve(result);
        return;
      }

      const channel = parsed.rss.channel?.[0];
      if (!channel) {
        result.isValid = false;
        result.errors.push("channel 요소가 없습니다");
        resolve(result);
        return;
      }

      // 필수 요소 검증
      if (!channel.title?.[0]) {
        result.isValid = false;
        result.errors.push("channel title이 없습니다");
      }

      if (!channel.description?.[0]) {
        result.isValid = false;
        result.errors.push("channel description이 없습니다");
      }

      if (!channel.link?.[0]) {
        result.isValid = false;
        result.errors.push("channel link가 없습니다");
      }

      // 아이템 검증
      const items = channel.item || [];
      if (items.length === 0) {
        result.warnings.push("RSS 피드에 아이템이 없습니다");
      }

      items.forEach((item, index) => {
        if (!item.title?.[0] && !item.description?.[0]) {
          result.errors.push(`아이템 ${index + 1}: title 또는 description이 필요합니다`);
          result.isValid = false;
        }

        if (!item.link?.[0]) {
          result.warnings.push(`아이템 ${index + 1}: link가 없습니다`);
        }

        if (!item.guid?.[0]) {
          result.warnings.push(`아이템 ${index + 1}: guid가 없습니다`);
        }

        if (!item.pubDate?.[0]) {
          result.warnings.push(`아이템 ${index + 1}: pubDate가 없습니다`);
        }
      });

      resolve(result);
    });
  });
}

// 개발 환경에서 RSS 검증 미들웨어
export async function validateRSSMiddleware(xmlContent: string) {
  if (process.env.NODE_ENV === "development") {
    const validation = await validateRSSFeed(xmlContent);
    
    if (!validation.isValid) {
      console.error("RSS 검증 실패:", validation.errors);
    }
    
    if (validation.warnings.length > 0) {
      console.warn("RSS 경고:", validation.warnings);
    }
  }
  
  return xmlContent;
}
```

### 3. RSS 피드 모니터링

RSS 피드 생성 성능과 에러를 모니터링하는 시스템을 구축했다.

```ts title:lib/rss-logger.ts
interface RSSMetrics {
  generationTime: number;
  postCount: number;
  feedSize: number;
  errors: string[];
  timestamp?: number;
}

export class RSSLogger {
  private static metrics: RSSMetrics[] = [];
  private static maxMetrics = 100;

  static logGeneration(metrics: Omit<RSSMetrics, "timestamp">) {
    const metricWithTimestamp = {
      ...metrics,
      timestamp: Date.now()
    };

    this.metrics.push(metricWithTimestamp);

    // 최근 100개 기록만 유지
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // 에러가 있으면 콘솔에 출력
    if (metrics.errors.length > 0) {
      console.error("RSS Generation Errors:", metrics.errors);
    }

    // 생성 시간이 1초 이상이면 경고
    if (metrics.generationTime > 1000) {
      console.warn(`RSS 생성 시간이 길어졌습니다: ${metrics.generationTime}ms`);
    }
  }

  static getMetrics() {
    return this.metrics;
  }

  static getAverageGenerationTime() {
    if (this.metrics.length === 0) return 0;
    
    const total = this.metrics.reduce((sum, m) => sum + m.generationTime, 0);
    return Math.round(total / this.metrics.length);
  }

  static getErrorRate() {
    if (this.metrics.length === 0) return 0;
    
    const errorCount = this.metrics.filter(m => m.errors.length > 0).length;
    return (errorCount / this.metrics.length) * 100;
  }

  static getReport() {
    const lastHour = Date.now() - 3600000;
    const recentMetrics = this.metrics.filter(m => m.timestamp! > lastHour);

    return {
      totalGenerations: recentMetrics.length,
      averageGenerationTime: this.getAverageGenerationTime(),
      errorRate: this.getErrorRate(),
      averageFeedSize: recentMetrics.reduce((sum, m) => sum + m.feedSize, 0) / recentMetrics.length || 0,
      averagePostCount: recentMetrics.reduce((sum, m) => sum + m.postCount, 0) / recentMetrics.length || 0,
    };
  }
}

// RSS 생성 성능 측정 래퍼
export async function measureRSSGeneration<T>(
  feedName: string,
  generatorFn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  const errors: string[] = [];
  
  try {
    const result = await generatorFn();
    const generationTime = Date.now() - startTime;
    
    // 결과를 문자열로 변환하여 크기 측정
    const feedSize = new TextEncoder().encode(String(result)).length;
    
    RSSLogger.logGeneration({
      generationTime,
      postCount: 0, // 실제 구현에서는 포스트 수를 전달
      feedSize,
      errors
    });
    
    return result;
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    
    RSSLogger.logGeneration({
      generationTime: Date.now() - startTime,
      postCount: 0,
      feedSize: 0,
      errors
    });
    
    throw error;
  }
}
```

## 마무리

RSS는 오래된 기술이지만 여전히 콘텐츠 배포에 매우 유용한 도구다. Next.js의 Route Handler를 활용하면 동적이고 효율적인 RSS 피드를 쉽게 구현할 수 있었다.

이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/mydevlog)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.