---
title: "[Next.js] Metadata API 사용해 SEO 최적화하기"
slug: "nextjs-13-metadata-api"
date: 2025-06-17
tags: ["Devlog", "MetadataAPI", "SEO"]
category: "Series/devlog"
draft: false
views: 0
---
포트폴리오 페이지인 `/`는 색인이 잘 되었지만, 정작 중요한 `/devlog` 부분이 전혀 색인되지 않았다.
발견한 주요 문제점들은 다음과 같다.

- **메타데이터 부족**: title, description 등 기본 SEO 태그가 누락되어 있었음
- **사이트맵 문제**: 사이트맵은 있는데 검색 엔진이 페이지를 제대로 발견하지 못 함
- **구조화된 데이터 부족**: 리치 스니펫이 표시되지 않음
- **성능 이슈**: 느린 로딩 속도로 인해 SEO 점수가 하락
- **내부 링크 부족**: 페이지 간 연결성이 부족해 크롤링 효율이 떨어짐

## 기본 메타데이터 최적화

### 동적 메타데이터 생성

Next.js 13의 Metadata API를 활용해 페이지별로 최적화된 메타데이터를 동적으로 생성했다.

```ts
// app/devlog/posts/[...slug]/page.tsx
import { Metadata } from "next";
import { getPostBySlug } from "@/lib/posts";

interface Props {
  params: { slug: string[] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug.join("/");
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = `${post.title} | nullisdefined`;
  const description = post.description || post.content.slice(0, 160) + "...";
  const url = `https://nullisdefined.site/devlog/posts/${slug}`;
  const imageUrl = post.thumbnail || "https://nullisdefined.site/og-image.png";

  return {
    title,
    description,
    keywords: post.tags.join(", "),
    authors: [{ name: "Jaewoo Kim" }],
    
    // Open Graph
    openGraph: {
      title,
      description,
      url,
      siteName: "nullisdefined",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "ko_KR",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: ["Jaewoo Kim"],
      tags: post.tags,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@nullisdefined",
    },

    // 검색 엔진 최적화
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    
    alternates: {
      canonical: url,
    },
  };
}
```

이렇게 설정하면 각 포스트마다 고유한 메타데이터가 생성되어 검색 엔진이 콘텐츠를 더 잘 이해할 수 있게 된다.

### 루트 레이아웃 메타데이터

전체 사이트의 기본 메타데이터도 체계적으로 정리했다.

- `app/layout.tsx` 변경

## 사이트맵 자동화

### 동적 사이트맵 생성

Next.js 13의 파일 기반 사이트맵 생성 기능을 활용했다.

```tsx
// app/sitemap.ts
import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const baseUrl = "https://nullisdefined.site";

  // 정적 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/devlog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  // 블로그 포스트들
  const postPages = posts.map((post) => ({
    url: `${baseUrl}/devlog/posts/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 카테고리 페이지들
  const categories = [...new Set(posts.map(post => post.category))];
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/devlog/categories/${category.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 태그 페이지들
  const allTags = [...new Set(posts.flatMap(post => post.tags))];
  const tagPages = allTags.map((tag) => ({
    url: `${baseUrl}/devlog/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
}
```

### next-sitemap을 활용한 고급 설정

더 세밀하게 조정이 필요한 경우 next-sitemap 패키지를 활용했다.

```js
// next-sitemap.config.js
const postsData = require("./scripts/posts-data");

function formatDate(date) {
  if (!date) return new Date().toISOString();
  
  try {
    if (typeof date === 'string' && date.includes('T')) {
      return date;
    }
    
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date');
    }
    return d.toISOString();
  } catch (error) {
    console.warn('Invalid date format:', date);
    return new Date().toISOString();
  }
}

module.exports = {
  siteUrl: "https://nullisdefined.site",
  generateRobotsTxt: true,
  exclude: ["/devlog/admin/*"],
  sitemapSize: 5000,

  async additionalPaths() {
    const posts = postsData.getPostList();
    const seriesPosts = postsData.getSeriesPostList();

    return [...posts, ...seriesPosts].map((post) => ({
      loc: `/devlog/${post.urlCategory}/${post.slug}`,
      lastmod: formatDate(post.date),
      changefreq: "weekly",
      priority: 0.8,
    }));
  },
};
```

## 구조화된 데이터 구현

검색 결과에서 리치 스니펫을 표시하기 위해 JSON-LD 형식의 구조화된 데이터를 추가했다.

### 블로그 포스트 구조화 데이터

```tsx
// components/structured-data.tsx
import { Post } from "@/types";

interface StructuredDataProps {
  post: Post;
}

export default function StructuredData({ post }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.thumbnail ? [post.thumbnail] : [],
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: {
      "@type": "Person",
      name: "Jaewoo Kim",
      url: "https://nullisdefined.site",
      sameAs: [
        "https://github.com/nullisdefined",
        "https://linkedin.com/in/your-profile"
      ]
    },
    publisher: {
      "@type": "Organization",
      name: "nullisdefined",
      logo: {
        "@type": "ImageObject",
        url: "https://nullisdefined.site/logo.png"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://nullisdefined.site/devlog/posts/${post.slug}`
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    wordCount: post.content.split(" ").length,
    inLanguage: "ko-KR"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

## 성능 최적화

### 이미지 최적화

Next.js의 Image 컴포넌트를 활용해 이미지 로딩을 최적화했다.

```tsx
// components/optimized-image.tsx
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width = 800, 
  height = 400, 
  priority = false 
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{
        width: "100%",
        height: "auto",
      }}
    />
  );
}
```

### 코드 스플리팅과 레이지 로딩

무거운 컴포넌트는 dynamic import를 사용해 필요할 때만 로드되도록 했다.

```tsx
// components/lazy-components.tsx
import dynamic from "next/dynamic";

// 댓글 시스템 레이지 로딩
const Comments = dynamic(
  () => import("@/components/devlog/comments"),
  {
    loading: () => <div>댓글을 불러오는 중...</div>,
    ssr: false
  }
);

// 차트 컴포넌트 레이지 로딩
const Chart = dynamic(
  () => import("@/components/chart"),
  {
    loading: () => <div>차트를 불러오는 중...</div>,
    ssr: false
  }
);
```

### Core Web Vitals 개선

웹 성능 지표를 모니터링하고 개선하였다.

```tsx
// lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

function sendToAnalytics(metric: any) {
  // Google Analytics로 전송
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

export function reportWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

## 배포 자동화

SEO 최적화와 함께 배포 프로세스도 자동화하였다. 글 작성부터 구글에 사이트맵 업데이트를 알리는 것까지 한 번의 명령으로 처리할 수 있도록 했다.

```bash
#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DATE=$(date +%Y-%m-%d)

echo -e "${YELLOW}Starting blog deployment process...${NC}"

# Obsidian 동기화
echo -e "${GREEN}Syncing blog posts...${NC}"
npm run sync

# Git 상태 확인 및 배포
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${GREEN}Changes detected, committing...${NC}"
    git add .
    git commit -m "Update blog posts ($DATE)"
    git push
    
    echo -e "${GREEN}Building site and generating sitemap...${NC}"
    npm run build
    
    echo -e "${GREEN}Notifying Google about sitemap update...${NC}"
    curl -X GET "http://www.google.com/ping?sitemap=https://nullisdefined.site/sitemap.xml"
    
    echo -e "${GREEN}Deployment completed successfully!${NC}"
else
    echo -e "${YELLOW}No changes detected${NC}"
fi
```

이 스크립트는 다음과 같은 작업을 자동으로 수행한다.

1. Obsidian에서 작성한 글을 블로그로 동기화
2. 변경사항이 있을 경우 자동으로 커밋 및 푸시
3. 사이트 빌드 및 사이트맵 생성
4. Google에 사이트맵 업데이트 알림

> 이 프로젝트의 모든 소스 코드는 [GitHub]()에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.