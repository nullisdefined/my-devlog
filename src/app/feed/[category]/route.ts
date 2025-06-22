import { getAllPosts } from "@/lib/posts";
import { generateCategoryFeed, generateRSSXML } from "@/lib/rss-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const posts = await getAllPosts();
    const category = decodeURIComponent(params.category);

    // 해당 카테고리의 포스트가 있는지 확인
    const categoryPosts = posts.filter(
      (post) => post.category?.toLowerCase() === category.toLowerCase()
    );

    if (categoryPosts.length === 0) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const rss = generateCategoryFeed(category, posts);
    const xml = generateRSSXML(rss);

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating category RSS feed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
