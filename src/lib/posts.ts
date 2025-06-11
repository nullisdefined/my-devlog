import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/types/index";
import { getFirstParagraph } from "@/lib/remove-markdown-utils";

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

    const basePath = category.toLowerCase().startsWith("series/")
      ? SERIES_PATH
      : POSTS_PATH;
    const categoryPath = category.toLowerCase().startsWith("series/")
      ? normalizedCategory.replace("series/", "")
      : normalizedCategory;

    // 파일 검색 시 frontmatter의 slug 필드도 확인
    const dirFiles = fs.readdirSync(path.join(basePath, categoryPath));
    let filePath = null;

    for (const file of dirFiles) {
      if (!file.endsWith(".md")) continue;

      const fullPath = path.join(basePath, categoryPath, file);
      const content = fs.readFileSync(fullPath, "utf-8");
      const { data } = matter(content);

      // frontmatter에 slug가 있으면 그것을 우선 사용
      if (
        data.slug === decodedSlug ||
        path.basename(file, ".md") === decodedSlug
      ) {
        filePath = fullPath;
        break;
      }
    }

    if (!filePath) return null;

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      title: data.title,
      date: data.date,
      category: data.category || normalizedCategory,
      slug: data.slug || decodedSlug, // frontmatter의 slug 우선 사용
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
          content: getFirstParagraph(content, 200),
          urlCategory,
        });
      }
    };

    processDirectory(POSTS_PATH);

    return allPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    // console.error("Error reading posts:", error);
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
          slug: data.slug || path.basename(file, ".md"),
          tags: data.tags || [],
          thumbnail: data.thumbnail,
          content: getFirstParagraph(content, 200),
          urlCategory,
        });
      }
    };

    // series 폴더만 처리
    processDirectory(SERIES_PATH, []);

    return allPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    return [];
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const [posts, seriesPosts] = await Promise.all([
    getPostList(),
    getSeriesPostList(),
  ]);

  // 중복 제거를 위한 map
  const uniquePosts = new Map<string, Post>();

  // 모든 포스트를 순회하면서 중복 체크
  [...posts, ...seriesPosts].forEach((post) => {
    if (post.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      // slug와 category를 조합하여 고유 키 생성
      const uniqueKey = `${post.category}/${post.slug}`;
      if (!uniquePosts.has(uniqueKey)) {
        uniquePosts.set(uniqueKey, post);
      }
    }
  });

  // map의 값들을 배열로 변환하여 반환
  return Array.from(uniquePosts.values());
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

export async function getAllPosts(): Promise<Post[]> {
  const [posts, seriesPosts] = await Promise.all([
    getPostList(),
    getSeriesPostList(),
  ]);

  // 중복 제거를 위한 map
  const uniquePosts = new Map<string, Post>();

  // 모든 포스트를 순회하면서 중복 체크
  [...posts, ...seriesPosts].forEach((post) => {
    // slug와 category를 조합하여 고유 키 생성
    const uniqueKey = `${post.category}/${post.slug}`;
    if (!uniquePosts.has(uniqueKey)) {
      uniquePosts.set(uniqueKey, post);
    }
  });

  // map의 값들을 배열로 변환하여 반환하고 날짜순 정렬
  return Array.from(uniquePosts.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
