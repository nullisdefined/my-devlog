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
