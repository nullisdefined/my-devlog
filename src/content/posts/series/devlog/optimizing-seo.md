---
title: "SEO 최적화"
slug: "optimizing-seo"
date: 2025-01-04
tags: ["NextJS", "SEO", "Devlog"]
category: "Series/devlog"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/86e097f8a63c767c7b899c570e74c017.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/86e097f8a63c767c7b899c570e74c017.png)

Google 검색엔진에서 내 블로그가 제대로 색인되지 않는 문제를 발견했다.

## SEO 최적화

### 문제 발견
포트폴리오 페이지인 `/`는 색인이 잘 되었지만,`/devlog` 부분이 색인되지 않았다. 이를 해결하기 위해 다음과 같은 단계별 접근을 시도했다.

1. **기본 SEO 설정 점검**
먼저, 가장 기본적인 SEO 요소들을 점검했다.

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "Devlog",
    template: "%s | Devlog"
  },
  description: "A personal blog dedicated to sharing insights and experiences in software development.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://nullisdefined.my'
  }
};
```

### 3. Next.js App Router 구조 최적화
App Router의 특성을 활용해 레이아웃과 페이지 구조를 개선했다.

```ts
// app/devlog/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "Devlog",
    template: "%s | Devlog"
  },
  description: "A personal blog dedicated to sharing insights and experiences in software development.",
  robots: {
    index: true,
    follow: true,
  }
};
```

### 4. 사이트맵 자동화
next-sitemap을 활용해 동적으로 사이트맵을 생성하도록 구현했다.

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
  siteUrl: "https://nullisdefined.my",
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

## 배포 자동화
글 작성부터 배포까지의 과정을 자동화하기 위해 배시 스크립트를 작성했다.

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
    curl -X GET "http://www.google.com/ping?sitemap=https://nullisdefined.my/sitemap.xml"
    
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

## 최종 워크플로우
1. Obsidian에서 Markdown으로 글 작성
2. `npm run deploy` 명령어 실행
3. 자동으로 파일 동기화, 배포, SEO 최적화 진행
4. Google Search Console에서 색인 생성 확인

## 마치며

SEO 최적화와 배포 자동화를 통해 블로그 운영의 효율성을 크게 높일 수 있었다. 특히 Next.js의 App Router와 next-sitemap을 활용한 구조화된 접근이 중요했다. 이제 검색엔진에서의 노출도 기대할 수 있게 되었다. Google뿐만 아니라 다른 검색엔진에서도 게시글이 잘 노출될 수 있도록 지속적으로 개선해 나갈 예정이다. 또한 지금은 간단한 배시 스크립트로 배포 자동화를 구현했지만, 추후 GitHub Actions를 활용한 CI/CD 파이프라인을 구축해 더 안정적인 배포 프로세스를 만들어 갈 계획이다.

이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/mydevlog)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.