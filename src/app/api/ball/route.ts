import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const BALL_CLICKS_KEY = "ball_clicks";

export async function POST() {
  try {
    const clicks = await redis.incr(BALL_CLICKS_KEY);
    return NextResponse.json({ clicks });
  } catch (error) {
    console.error("Error updating ball clicks:", error);
    return NextResponse.error();
  }
}

export async function GET() {
  try {
    const clicks = (await redis.get(BALL_CLICKS_KEY)) || "0";
    return NextResponse.json({ clicks: Number(clicks) });
  } catch (error) {
    console.error("Error getting ball clicks:", error);
    return NextResponse.error();
  }
}
