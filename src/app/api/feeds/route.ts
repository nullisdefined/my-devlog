import { getAllPosts } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await getAllPosts();

    // 모든 카테고리 수집
    const categories = new Set<string>();
    const tags = new Set<string>();

    posts.forEach((post) => {
      if (post.category) {
        categories.add(post.category);
      }
      post.tags?.forEach((tag) => {
        tags.add(tag);
      });
    });

    const feeds = {
      main: {
        title: "개발새발 - 전체 피드",
        url: "https://nullisdefined.my/feed.xml",
        description: "모든 블로그 포스트",
      },
      categories: Array.from(categories).map((category) => ({
        title: `개발새발 - ${category} 카테고리`,
        url: `https://nullisdefined.my/feed/${encodeURIComponent(category)}`,
        description: `${category} 관련 글들`,
        postCount: posts.filter((post) => post.category === category).length,
      })),
      tags: Array.from(tags).map((tag) => ({
        title: `개발새발 - ${tag} 태그`,
        url: `https://nullisdefined.my/feed/tags/${encodeURIComponent(tag)}`,
        description: `${tag} 태그가 포함된 글들`,
        postCount: posts.filter((post) => post.tags?.includes(tag)).length,
      })),
    };

    return NextResponse.json(feeds, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating feeds list:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
