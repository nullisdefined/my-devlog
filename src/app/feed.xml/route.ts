import { getAllPosts } from "@/lib/posts";
import { generateMainFeed, generateRSSXML } from "@/lib/rss-utils";
import { measureRSSGeneration } from "@/lib/rss-logger";
import { getCachedRSSFeed } from "@/lib/rss-cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const xml = await measureRSSGeneration("main-feed", "main", async () => {
      const posts = await getCachedRSSFeed();
      const rss = generateMainFeed(posts);
      return generateRSSXML(rss);
    });

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Feed-Type": "main",
        "X-Generated-At": new Date().toISOString(),
        "X-Robots-Tag": "index, follow",
        Link: '<https://nullisdefined.my/devlog>; rel="alternate"; type="text/html"',
        "Last-Modified": new Date().toUTCString(),
        ETag: `"${Date.now()}"`,
        Vary: "Accept-Encoding",
      },
    });
  } catch (error) {
    console.error("Error generating main RSS feed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
