---
title: "[Next.js] 사이트맵 자동 생성하기"
slug: "sitemap-script"
date: 2024-12-17
tags: ["NextJS", "SEO", "Devlog"]
category: "Series/devlog"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c9870b4f6ce1b0451761374cd9403ea1.png"
draft: false
views: 0
---
블로그를 개발하면서 SEO(검색 엔진 최적화)는 필수로 챙겨야 할 요소라고 생각했다. 또 블로그에 새로운 페이지가 업데이트될 때마다 Google이나 다른 검색 엔진에서 어떤 과정을 거치게 될까 궁금해 찾아보다 사이트맵이라는 개념을 알게 되었다. 이 글에서는 next-sitemap 라이브러리를 사용해서 사이트맵을 생성하고, Google Search Console에 도메인을 등록하는 과정을 정리한 내용이다.

## 사이트맵(sitemap)이란?
간단히 말하자면 내 사이트에 어떤 페이지들이 있는지 검색 엔진에게 알려주는 역할을 한다. 어떤 페이지들이 있고, 언제 수정되었는지, 페이지의 우선순위는 어떤지 등의 정보를 포함하고 있어 검색 엔진 크롤러가 내 사이트를 더 빠르고 효율적으로 탐색할 수 있도록 돕는다.
### robots.txt란?
`robots.txt`는 크롤러에게 어떤 페이지에 접근해도 되는지, 어떤 경로는 접근하지 말아야 하는지를 알려주는 역할을 한다. 또한 사이트맵 파일의 위치를 명시해 검색 엔진이 더 효율적으로 내 사이트를 탐색하도록 돕는다.
```txt title:robots.txt
# *
User-agent: *
Allow: /

# Host
Host: https://nullisdefined.site

# Sitemaps
Sitemap: https://nullisdefined.site/sitemap.xml

```
## next-sitemap 적용하기
먼저 `next-sitemap`라이브러리를 설치한다.
```shell
npm install next-sitemap --save-dev
```
### 설정 파일 생성
프로젝트 루트 디렉터리에 `next-sitemap.config.js` 파일을 만들고 설정을 추가한다.

```js title:next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://nullisdefined.site",
  generateRobotsTxt: true, // robots.txt 자동 생성
};

```
위 설정을 통해 `sitemap.xml`과 `robots.txt`를 자동으로 생성할 수 있다.

## 블로그 글 동적 경로 추가하기
이 블로그는 Markdown 파일로 글을 작성하고 Next.js에서 동적으로 불러오는 구조다. 따라서 블로그 글들의 URL을 사이트맵에 추가하려면 추가적인 작업이 필요했다.

### 문제점: 빌드되지 않은 src 파일 접근
next-sitemap은 실행될 때 Node.js에서 src 폴더의 TypeScript 파일을 로드하려 했는데, 빌드가 안 된 상태라서 MODULE_NOT_FOUND 에러가 발생했다. 처음에는 설정이 잘못된 줄 알고 `next-sitemap`의 옵션을 바꿔보았지만 해결되지 않았다. 나중에야 Node.js가 TypeScript 파일을 직접 실행할 수 없으며 빌드된 JavaScript 파일만 불러올 수 있다는 점을 깨달았다. 이 시행착오를 통해 Node.js 스크립트 실행 시 빌드된 파일만 접근해야 한다는 점을 배웠고, 이를 해결하기 위해 별도의 스크립트를 작성하게 되었다.

#### 블로그 데이터 추출 스크립트
`scripts/posts-data.js`파일을 만들어 Markdown 파일에서 데이터를 추출했다.

```js title:posts-data.js
const path = require("path");
const fs = require("fs");
const matter = require("gray-matter");

const POSTS_PATH = path.join(process.cwd(), "src/content/posts");
const SERIES_PATH = path.join(process.cwd(), "src/content/posts/series");

function getPostList(basePath) {
  const allPosts = [];

  const processDirectory = (dirPath, categoryPath = []) => {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        processDirectory(fullPath, [...categoryPath, file.toLowerCase()]);
        continue;
      }

      if (!file.endsWith(".md")) continue;

      const fileContent = fs.readFileSync(fullPath, "utf-8");
      const { data } = matter(fileContent);

      if (data.draft) continue;

      const urlCategory = categoryPath.join("/");

      allPosts.push({
        urlCategory,
        slug: path.basename(file, ".md"),
        date: data.date || new Date().toISOString(),
      });
    }
  };

  processDirectory(basePath);
  return allPosts;
}

module.exports = {
  getPostList: () => getPostList(POSTS_PATH),
  getSeriesPostList: () => getPostList(SERIES_PATH),
};

```

이제 이 스크립트를 `next-sitemap.config.js`에서 사용하여 동적 경로를 추가했다.

```js title:next-sitemap.config.js
const { getPostList, getSeriesPostList } = require("./scripts/posts-data");

module.exports = {
  siteUrl: "https://nullisdefined.site",
  generateRobotsTxt: true,
  exclude: ["/devlog/admin/*"],
  sitemapSize: 5000,

  async additionalPaths() {
    const posts = getPostList();
    const seriesPosts = getSeriesPostList();

    const allPosts = [...posts, ...seriesPosts];

    return allPosts.map((post) => ({
      loc: `/devlog/${post.urlCategory}/${post.slug}`,
      lastmod: post.date,
      changefreq: "weekly",
      priority: 0.8,
    }));
  },
};

```

## 배포 자동화하기
사이트맵 생성 작업을 배포 과정에서 자동으로 실행되도록 스크립트를 설정했다.

```json
"scripts": {
  "build": "next build",
  "postbuild": "next-sitemap"
}
```

Vercel이나 CI/CD 과정에서 자동으로 `npm run build` 이후 `postbuild`가 실행되어 사이트맵이 생성된다.

## Google Search Console에 등록하기
1. Google Search Console에 접속하여 내 블로그 도메인을 등록한다.
2. 도메인 소유권 확인 절차를 완료한다.
3. 등록이 완료되면 Sitemaps 메뉴에서 `https://도메인/sitemap.xml` 경로를 제출한다.
4. Google에서 사이트맵을 크롤링하고 내 블로그의 페이지를 인식하기 시작한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c9870b4f6ce1b0451761374cd9403ea1.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2755a10b307891c9d6c7bf933863d2aa.png)
*데이터를 처리하는데 시간이 조금 걸리는 듯하다*

## 마무리

이번 작업을 통해 사이트맵과 SEO를 효과적으로 관리하는 방법을 익힐 수 있었다. next-sitemap 라이브러리를 활용해 정적 페이지와 동적 경로를 손쉽게 사이트맵에 포함시킬 수 있었고, 빌드된 JS 파일만 접근 가능한 구조라는 점을 알게 되면서, 이를 해결하기 위해 별도의 스크립트를 작성한 경험도 값진 배움이 되었다.

이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/mydevlog)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.