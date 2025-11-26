/* eslint-disable @typescript-eslint/no-require-imports */
const { getPostList, getSeriesPostList } = require("./scripts/posts-data");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

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
  siteUrl: process.env.SITE_URL || "https://www.nullisdefined.my",
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
  ],

  // 추가 경로 및 우선순위 설정
  additionalPaths: async (config) => {
    const paths = [];

    // 메인 devlog 페이지 추가
    paths.push(
      await config.transform(config, "/devlog", {
        priority: 1.0,
        changefreq: "daily",
        lastmod: new Date().toISOString(),
      }),
    );

    // 모든 개별 포스트 추가
    try {
      const posts = getPostList();
      for (const post of posts) {
        const postUrl = `/devlog/posts/${post.urlCategory}/${post.slug}`;
        paths.push(
          await config.transform(config, postUrl, {
            priority: 0.9,
            changefreq: "monthly",
            lastmod: formatDate(post.date),
          }),
        );
      }
    } catch (error) {
      console.warn("포스트 목록을 가져오는데 실패했습니다:", error);
    }

    // 시리즈 포스트 추가
    try {
      const seriesPosts = getSeriesPostList();
      for (const post of seriesPosts) {
        const postUrl = `/devlog/posts/${post.urlCategory}/${post.slug}`;
        paths.push(
          await config.transform(config, postUrl, {
            priority: 0.9,
            changefreq: "monthly",
            lastmod: formatDate(post.date),
          }),
        );
      }
    } catch (error) {
      console.warn("시리즈 포스트 목록을 가져오는데 실패했습니다:", error);
    }

    // 카테고리 페이지 추가
    try {
      const allPosts = [...getPostList(), ...getSeriesPostList()];
      const categories = new Set();

      allPosts.forEach((post) => {
        if (post.urlCategory) {
          categories.add(post.urlCategory);
        }
      });

      for (const category of categories) {
        const categoryUrl = `/devlog/categories/${category}`;
        paths.push(
          await config.transform(config, categoryUrl, {
            priority: 0.8,
            changefreq: "weekly",
            lastmod: new Date().toISOString(),
          }),
        );
      }
    } catch (error) {
      console.warn("카테고리 목록을 가져오는데 실패했습니다:", error);
    }

    // 태그 페이지 추가
    try {
      const postsPath = path.join(process.cwd(), "src/content/posts");
      const allPosts = [];

      const processDirectory = (dirPath, categoryPath = []) => {
        if (!fs.existsSync(dirPath)) return;

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
          if (data.tags) {
            allPosts.push({ tags: data.tags });
          }
        }
      };

      processDirectory(postsPath);

      const tags = new Set();
      allPosts.forEach((post) => {
        if (post.tags) {
          post.tags.forEach((tag) => tags.add(tag.toLowerCase()));
        }
      });

      for (const tag of tags) {
        const tagUrl = `/devlog/tags/${encodeURIComponent(tag)}`;
        paths.push(
          await config.transform(config, tagUrl, {
            priority: 0.6,
            changefreq: "weekly",
            lastmod: new Date().toISOString(),
          }),
        );
      }
    } catch (error) {
      console.warn("태그 목록을 가져오는데 실패했습니다:", error);
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
