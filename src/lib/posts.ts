import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/types/post";

const POSTS_PATH = path.join(process.cwd(), "src/content/posts");

export async function getPostBySlug(
  category: string,
  slug: string
): Promise<Post | null> {
  try {
    const filePath = path.join(
      POSTS_PATH,
      category.toLowerCase(),
      `${slug}.md`
    );

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // 필수 필드 검증
    if (!data.title || !data.date) {
      return null;
    }

    return {
      title: data.title,
      description: data.description || "",
      date: data.date,
      category: data.category || category,
      slug,
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
    if (!fs.existsSync(POSTS_PATH)) {
      return [];
    }

    const categories = fs.readdirSync(POSTS_PATH);
    const allPosts: Post[] = [];

    for (const category of categories) {
      const categoryPath = path.join(POSTS_PATH, category);

      if (!fs.statSync(categoryPath).isDirectory()) continue;

      const posts = fs
        .readdirSync(categoryPath)
        .filter((filename) => filename.endsWith(".md"));

      for (const filename of posts) {
        const filePath = path.join(categoryPath, filename);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        if (data.draft) continue;

        allPosts.push({
          title: data.title,
          description: data.description || "",
          date: data.date,
          category: data.category || category,
          slug: filename.replace(".md", ""),
          tags: data.tags || [],
          thumbnail: data.thumbnail,
          content: content.slice(0, 200), // 미리보기용 content 추가
        });
      }
    }

    return allPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    return [];
  }
}
