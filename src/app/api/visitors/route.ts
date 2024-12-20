import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { headers } from "next/headers";

// ! 방문자 카운트 2씩 증가하고있음

export async function POST() {
  try {
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const today = new Date().toISOString().split("T")[0];
    const ipKey = `visitors:${today}:${ip}`;

    // 해당 IP의 오늘 방문 여부 확인
    const hasVisitedToday = await redis.exists(ipKey);

    if (!hasVisitedToday) {
      // 새로운 방문자인 경우
      // IP 방문 기록 저장 (24시간 후 자동 삭제)
      await redis.setex(ipKey, 24 * 60 * 60, "1");

      // 전체 방문자 수 증가
      await redis.incr("total_visitors");

      // 오늘의 순방문자 수 증가
      await redis.incr(`daily_visitors:${today}`);
    }

    // 전체 방문자 수와 오늘의 방문자 수 조회
    const [totalVisitors, todayVisitors] = await Promise.all([
      redis.get("total_visitors"),
      redis.get(`daily_visitors:${today}`),
    ]);

    return NextResponse.json({
      total: Number(totalVisitors) || 0,
      today: Number(todayVisitors) || 0,
    });
  } catch (error) {
    console.error("Error tracking visitors:", error);
    return NextResponse.error();
  }
}

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 전체 방문자 수와 오늘의 방문자 수 조회
    const [totalVisitors, todayVisitors] = await Promise.all([
      redis.get("total_visitors"),
      redis.get(`daily_visitors:${today}`),
    ]);

    return NextResponse.json({
      total: Number(totalVisitors) || 0,
      today: Number(todayVisitors) || 0,
    });
  } catch (error) {
    console.error("Error getting visitors:", error);
    return NextResponse.error();
  }
}
