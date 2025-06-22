import { getAllPosts } from "@/lib/posts";
import { generateTagFeed, generateRSSXML } from "@/lib/rss-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { tag: string } }
) {
  try {
    const posts = await getAllPosts();
    const tag = decodeURIComponent(params.tag);

    // 해당 태그의 포스트가 있는지 확인
    const tagPosts = posts.filter((post) => post.tags?.includes(tag));

    if (tagPosts.length === 0) {
      return new NextResponse("Tag not found", { status: 404 });
    }

    const rss = generateTagFeed(tag, posts);
    const xml = generateRSSXML(rss);

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating tag RSS feed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
