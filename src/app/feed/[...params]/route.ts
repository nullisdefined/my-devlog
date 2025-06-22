import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import {
  generateCategoryFeed,
  generateTagFeed,
  generateSeriesFeed,
  generateRSSXML,
} from "@/lib/rss-utils";
import { measureRSSGeneration } from "@/lib/rss-logger";
import {
  getCachedCategoryFeed,
  getCachedTagFeed,
  getCachedSeriesFeed,
} from "@/lib/rss-cache";

interface Props {
  params: { params: string[] };
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const [type, identifier] = params.params;

    if (!type || !identifier) {
      return new NextResponse("Invalid feed parameters", { status: 400 });
    }

    const feedResult = await measureRSSGeneration(
      `${type}-${identifier}`,
      type,
      async () => {
        let posts;
        let feed;

        switch (type) {
          case "category":
            posts = await getCachedCategoryFeed(identifier);
            if (posts.length === 0) {
              throw new Error(
                `Category '${identifier}' not found or has no posts`
              );
            }
            feed = generateCategoryFeed(identifier, posts);
            break;

          case "tags":
            const decodedTag = decodeURIComponent(identifier);
            posts = await getCachedTagFeed(decodedTag);
            if (posts.length === 0) {
              throw new Error(`Tag '${decodedTag}' not found or has no posts`);
            }
            feed = generateTagFeed(decodedTag, posts);
            break;

          case "series":
            const decodedSeries = decodeURIComponent(identifier);
            posts = await getCachedSeriesFeed(decodedSeries);
            if (posts.length === 0) {
              throw new Error(
                `Series '${decodedSeries}' not found or has no posts`
              );
            }
            feed = generateSeriesFeed(decodedSeries, posts);
            break;

          default:
            throw new Error(`Invalid feed type: ${type}`);
        }

        return generateRSSXML(feed);
      }
    );

    return new NextResponse(feedResult, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Feed-Type": type,
        "X-Feed-Identifier": identifier,
        "X-Robots-Tag": "index, follow",
        Link: `<https://nullisdefined.site/devlog/${type}/${identifier}>; rel="alternate"; type="text/html"`,
        "Last-Modified": new Date().toUTCString(),
        ETag: `"${type}-${identifier}-${Date.now()}"`,
        Vary: "Accept-Encoding",
      },
    });
  } catch (error) {
    console.error("RSS Feed Generation Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("not found")) {
      return new NextResponse(errorMessage, { status: 404 });
    }

    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}

// 동적 라우트를 위한 정적 파라미터 생성
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();

    // 모든 카테고리 추출
    const categories = Array.from(
      new Set(posts.map((post) => post.category).filter(Boolean))
    );
    const categoryParams = categories.map((category) => ({
      params: ["category", category!.toLowerCase().replace(/\s+/g, "-")],
    }));

    // 모든 태그 추출
    const allTags = Array.from(
      new Set(posts.flatMap((post) => post.tags || []))
    );
    const tagParams = allTags.map((tag) => ({
      params: ["tags", encodeURIComponent(tag)],
    }));

    // 시리즈 추출 (카테고리에서 "Series/" 포함된 것들)
    const series = Array.from(
      new Set(
        posts
          .map((post) => post.category)
          .filter((category) => category?.includes("Series/"))
          .map((category) => category?.replace("Series/", ""))
          .filter(Boolean)
      )
    );
    const seriesParams = series.map((s) => ({
      params: ["series", encodeURIComponent(s!)],
    }));

    return [...categoryParams, ...tagParams, ...seriesParams];
  } catch (error) {
    console.error("Error generating static params for RSS feeds:", error);
    return [];
  }
}

// 메타데이터 생성
export async function generateMetadata({ params }: Props) {
  const [type, identifier] = params.params;
  const decodedIdentifier = decodeURIComponent(identifier);

  const titles = {
    category: `개발새발 - ${decodedIdentifier} 카테고리`,
    tags: `개발새발 - ${decodedIdentifier} 태그`,
    series: `개발새발 - ${decodedIdentifier} 시리즈`,
  };

  const descriptions = {
    category: `${decodedIdentifier} 카테고리의 모든 글을 RSS로 구독하세요`,
    tags: `${decodedIdentifier} 태그가 포함된 모든 글을 RSS로 구독하세요`,
    series: `${decodedIdentifier} 시리즈의 모든 글을 RSS로 구독하세요`,
  };

  return {
    title: titles[type as keyof typeof titles] || "RSS Feed",
    description: descriptions[type as keyof typeof descriptions] || "RSS Feed",
    alternates: {
      types: {
        "application/rss+xml": `https://nullisdefined.site/feed/${type}/${identifier}`,
      },
    },
  };
}
