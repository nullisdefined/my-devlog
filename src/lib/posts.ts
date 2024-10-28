import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/types/index";

const POSTS_PATH = path.join(process.cwd(), "src/content/posts");
const SERIES_PATH = path.join(process.cwd(), "src/content/posts/series");

// URL에서 특수문자를 제거하는 함수
const normalizeCategory = (category: string): string => {
  return category
    .toLowerCase()
    .split("/")
    .map((segment) => segment.replace(/[^a-z0-9-]/g, ""))
    .join("/");
};

export async function getPostBySlug(
  category: string,
  slug: string
): Promise<Post | null> {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const normalizedCategory = normalizeCategory(decodeURIComponent(category));

    // 시리즈와 일반 카테고리 구분
    const basePath = category.toLowerCase().startsWith("series/")
      ? SERIES_PATH
      : POSTS_PATH;
    const categoryPath = category.toLowerCase().startsWith("series/")
      ? normalizedCategory.replace("series/", "")
      : normalizedCategory;

    const filePath = path.join(basePath, categoryPath, `${decodedSlug}.md`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      title: data.title,
      date: data.date,
      category: data.category || normalizedCategory,
      slug: decodedSlug,
      tags: data.tags || [],
      thumbnail: data.thumbnail,
      content,
    };
  } catch (error) {
    return null;
  }
}

export async function getPostList(): Promise<Post[]> {
  try {
    const allPosts: Post[] = [];

    const processDirectory = (dirPath: string, categoryPath: string[] = []) => {
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
        const { data, content } = matter(fileContent);

        if (data.draft) continue;

        const urlCategory = categoryPath.join("/");

        allPosts.push({
          title: data.title,
          date: data.date,
          category: data.category || urlCategory,
          slug: path.basename(file, ".md"),
          tags: data.tags || [],
          thumbnail: data.thumbnail,
          content: content.slice(0, 200),
          urlCategory,
        });
      }
    };

    processDirectory(POSTS_PATH);

    return allPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error reading posts:", error);
    return [];
  }
}

export async function getSeriesPostList(): Promise<Post[]> {
  try {
    const allPosts: Post[] = [];

    const processDirectory = (dirPath: string, categoryPath: string[] = []) => {
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
        const { data, content } = matter(fileContent);

        if (data.draft) continue;

        // urlCategory를 series 폴더부터 시작하도록 설정
        const urlCategory = ["series", ...categoryPath].join("/");

        allPosts.push({
          title: data.title,
          date: data.date,
          category: data.category || urlCategory,
          slug: path.basename(file, ".md"),
          tags: data.tags || [],
          thumbnail: data.thumbnail,
          content: content.slice(0, 200),
          urlCategory,
        });
      }
    };

    // series 폴더만 처리
    processDirectory(SERIES_PATH, []);

    console.log("Found series posts:", allPosts); // 디버깅용

    return allPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error reading series posts:", error);
    return [];
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const [posts, seriesPosts] = await Promise.all([
    getPostList(),
    getSeriesPostList(),
  ]);
  const allPosts = [...posts, ...seriesPosts];

  return allPosts.filter((post) =>
    post.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export async function getAllTags(): Promise<string[]> {
  const [posts, seriesPosts] = await Promise.all([
    getPostList(),
    getSeriesPostList(),
  ]);
  const allPosts = [...posts, ...seriesPosts];
  const tagsSet = new Set<string>();

  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tagsSet.add(tag.toLowerCase());
    });
  });

  return Array.from(tagsSet).sort();
}
