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

module.exports = {
  siteUrl: "https://nullisdefined.site",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/*"],
      },
    ],
  },
  exclude: ["/devlog/admin/*"],
  sitemapSize: 5000,

  async additionalPaths() {
    try {
      const posts = await getPostList();
      const uniqueUrls = new Set();

      return posts
        .filter((post) => {
          if (!post.urlCategory || !post.slug) {
            console.warn(
              `Invalid post data: missing urlCategory or slug`,
              post
            );
            return false;
          }

          if (post.urlCategory.startsWith("series/")) {
            return false;
          }

          const url = `/devlog/posts/${post.urlCategory}/${post.slug}`;
          if (uniqueUrls.has(url)) return false;

          uniqueUrls.add(url);
          return true;
        })
        .map((post) => ({
          loc: `/devlog/posts/${post.urlCategory}/${post.slug}`,
          lastmod: formatDate(post.date),
          changefreq: "weekly",
          priority: 0.9,
        }));
    } catch (error) {
      console.error("Failed to generate additional paths:", error);
      return [];
    }
  },
};
