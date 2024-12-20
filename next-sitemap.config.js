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
