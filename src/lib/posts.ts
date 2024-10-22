import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrism from "rehype-prism-plus";
import { Post } from "@/types/post";

const POSTS_PATH = path.join(process.cwd(), "src/content/posts");

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

      allPosts.push({
        title: data.title,
        description: data.description,
        date: data.date,
        category: data.category,
        slug: filename.replace(".md", ""),
        tags: data.tags || [],
        thumbnail: data.thumbnail,
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
  const filePath = path.join(POSTS_PATH, category.toLowerCase(), `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  // 마크다운을 HTML로 변환
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(content);

  return {
    title: data.title,
    description: data.description,
    date: data.date,
    category: data.category,
    slug,
    tags: data.tags || [],
    thumbnail: data.thumbnail,
    content: processedContent.toString(),
  };
}
