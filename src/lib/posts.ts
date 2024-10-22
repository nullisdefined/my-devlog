import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/types/post";

const POSTS_PATH = path.join(process.cwd(), "src/content/posts");

function extractFirstSentence(text: string): string {
  const cleaned = text.replace(/[#*`]/g, "").trim();
  const words = cleaned.split(/\s+/);
  const excerpt = words.slice(0, 2).join(" ");
  return excerpt + "...";
}

export async function getPostList(): Promise<Post[]> {
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

      const firstParagraph =
        content
          .split("\n")
          .find((line) => line.trim() !== "" && !line.startsWith("#"))
          ?.trim() || "";

      allPosts.push({
        title: data.title,
        description: data.description || extractFirstSentence(firstParagraph),
        date: data.date,
        category: data.category,
        slug: filename.replace(".md", ""),
        tags: data.tags || [],
        thumbnail: data.thumbnail,
        readingTime: calculateReadingTime(content),
        content: data.description
          ? undefined
          : extractFirstSentence(firstParagraph),
      });
    }
  }

  return allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(
  category: string,
  slug: string
): Promise<Post | null> {
  const filePath = path.join(POSTS_PATH, category, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    title: data.title,
    description: data.description,
    date: data.date,
    category: data.category,
    slug,
    tags: data.tags || [],
    thumbnail: data.thumbnail,
    readingTime: calculateReadingTime(content),
    content,
  };
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
