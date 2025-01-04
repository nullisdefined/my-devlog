const { getPostList, getSeriesPostList } = require("./scripts/posts-data");

function formatDate(date) {
  if (!date) return new Date().toISOString();

  try {
    if (typeof date === "string" && date.includes("T")) {
      return date;
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error("Invalid date");
    }
    return d.toISOString();
  } catch (error) {
    console.warn("Invalid date format:", date);
    return new Date().toISOString();
  }
}

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
      lastmod: formatDate(post.date),
      changefreq: "weekly",
      priority: 0.8,
    }));
  },
};
