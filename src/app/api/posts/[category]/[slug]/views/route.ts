import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { headers } from "next/headers";

// 게시글 조회수 증가
export async function POST(
  request: Request,
  { params }: { params: { category: string; slug: string } }
) {
  try {
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const { category, slug } = params;

    // 게시글별 IP 방문 기록 키
    const postIpKey = `post:${category}/${slug}:${ip}`;
    // 게시글 조회수 키
    const postViewsKey = `post:${category}/${slug}:views`;

    // 해당 IP의 게시글 방문 여부 확인 (24시간 동안 중복 카운트 방지)
    const hasVisited = await redis.exists(postIpKey);

    if (!hasVisited) {
      // 새로운 방문자인 경우
      // IP 방문 기록 저장 (24시간 후 자동 삭제)
      await redis.setex(postIpKey, 24 * 60 * 60, "1");
      // 조회수 증가
      await redis.incr(postViewsKey);
    }

    // 현재 조회수 조회
    const views = await redis.get(postViewsKey);

    return NextResponse.json({
      views: Number(views) || 0,
    });
  } catch (error) {
    console.error("Error tracking post views:", error);
    return NextResponse.error();
  }
}

// 게시글 조회수 조회
export async function GET(
  request: Request,
  { params }: { params: { category: string; slug: string } }
) {
  try {
    const { category, slug } = params;
    const postViewsKey = `post:${category}/${slug}:views`;

    // 현재 조회수 조회
    const views = await redis.get(postViewsKey);

    return NextResponse.json({
      views: Number(views) || 0,
    });
  } catch (error) {
    console.error("Error getting post views:", error);
    return NextResponse.error();
  }
}
