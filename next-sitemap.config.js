/* eslint-disable @typescript-eslint/no-require-imports */
const { getPostList } = require("./scripts/posts-data");

function formatDate(date) {
  if (!date) return undefined;

  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? undefined : d.toISOString().split("T")[0];
  } catch (error) {
    console.warn(`Invalid date format: ${date}`);
    return undefined;
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://nullisdefined.my",
  generateRobotsTxt: false, // robots.txt는 수동 관리
  autoLastmod: false,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  // 검색 엔진 색인 대상에서 제외할 경로들 (관리자/내부 API 등)
  exclude: [
    "/admin",
    "/admin/*",
    "/admin/**",
    "/api/*",
    "/api/**",
    "/feed",
    "/feed/*",
    "/feed/**",
    "/feed.xml",
    "/podcast.xml",
    "/devlog",
    "/devlog/*",
    "/devlog/**",
  ],

  // 추가 경로 및 우선순위 설정
  additionalPaths: async (config) => {
    const paths = [
      {
        loc: "/",
        priority: 1.0,
        changefreq: "daily",
      },
    ];

    // 모든 개별 포스트 추가
    try {
      const posts = getPostList();
      for (const post of posts) {
        const postUrl = `/posts/${post.urlCategory}/${post.slug}`;
        paths.push({
          loc: postUrl,
          priority: 0.9,
          changefreq: "monthly",
          lastmod: formatDate(post.date),
        });
      }
    } catch (error) {
      console.warn("포스트 목록을 가져오는데 실패했습니다:", error);
    }

    return paths;
  },

  transform: async (config, path) => {
    // 기본 설정
    let priority = 0.7;
    let changefreq = "weekly";

    // 메인 페이지
    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    }

    // 개별 포스트 페이지
    else if (path.includes("/posts/")) {
      priority = 0.9;
      changefreq = "monthly";
    }

    // 포트폴리오 페이지
    else if (path === "/portfolio") {
      priority = 0.8;
      changefreq = "monthly";
    }

    return {
      loc: path,
      changefreq,
      priority,
    };
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
