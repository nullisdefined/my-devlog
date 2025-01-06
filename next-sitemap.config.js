const { getPostList, getSeriesPostList } = require("./scripts/posts-data");

function formatDate(date) {
  if (!date) return new Date().toISOString().split("T")[0];

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error("Invalid date");
    }
    return d.toISOString().split("T")[0];
  } catch (error) {
    console.warn("Invalid date format:", date);
    return new Date().toISOString().split("T")[0];
  }
}

module.exports = {
  siteUrl: "https://nullisdefined.site",
  generateRobotsTxt: true,
  exclude: ["/devlog/admin/*", "/devlog/posts/*"],
  sitemapSize: 5000,

  async additionalPaths() {
    const posts = getPostList();
    const seriesPosts = getSeriesPostList();

    const uniqueUrls = new Set();
    const allPosts = [...posts, ...seriesPosts];

    return allPosts
      .filter((post) => {
        const url = `/devlog/${post.urlCategory}/${post.slug}`;
        if (uniqueUrls.has(url)) return false;
        uniqueUrls.add(url);
        return true;
      })
      .map((post) => ({
        loc: `/devlog/${post.urlCategory}/${post.slug}`,
        lastmod: formatDate(post.date),
        changefreq: "weekly",
        priority: 0.8,
      }));
  },
};
