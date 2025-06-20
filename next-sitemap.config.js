/* eslint-disable @typescript-eslint/no-require-imports */
const { getPostList, getSeriesPostList } = require("./scripts/posts-data");

function formatDate(date) {
  const defaultDate = new Date().toISOString().split("T")[0];

  if (!date) return defaultDate;

  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? defaultDate : d.toISOString().split("T")[0];
  } catch (error) {
    console.warn(`Invalid date format: ${date}`);
    return defaultDate;
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://nullisdefined.site",
  generateRobotsTxt: false, // robots.txt는 수동 관리
  autoLastmod: false,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,

  // 추가 경로 및 우선순위 설정
  additionalPaths: async (config) => {
    return [
      await config.transform(config, "/devlog", {
        priority: 1.0,
        changefreq: "daily",
        lastmod: new Date().toISOString(),
      }),
    ];
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

    // 블로그 메인 페이지
    else if (path === "/devlog") {
      priority = 1.0;
      changefreq = "daily";
    }

    // 개별 포스트 페이지
    else if (path.includes("/devlog/posts/")) {
      priority = 0.9;
      changefreq = "monthly";
    }

    // 카테고리 페이지
    else if (path.includes("/devlog/categories/")) {
      priority = 0.8;
      changefreq = "weekly";
    }

    // 시리즈 페이지
    else if (path.includes("/devlog/series/")) {
      priority = 0.8;
      changefreq = "weekly";
    }

    // 태그 페이지
    else if (path.includes("/devlog/tags/")) {
      priority = 0.6;
      changefreq = "weekly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
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
