import { getAllPosts } from "@/lib/posts";
import { generateSeriesFeed, generateRSSXML } from "@/lib/rss-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { series: string } }
) {
  try {
    const posts = await getAllPosts();
    const series = decodeURIComponent(params.series);

    // 해당 시리즈의 포스트가 있는지 확인
    const seriesPosts = posts.filter(
      (post) => post.category?.includes(series) || post.tags?.includes(series)
    );

    if (seriesPosts.length === 0) {
      return new NextResponse("Series not found", { status: 404 });
    }

    const rss = generateSeriesFeed(series, posts);
    const xml = generateRSSXML(rss);

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating series RSS feed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
