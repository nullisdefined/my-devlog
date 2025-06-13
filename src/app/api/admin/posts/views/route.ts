import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  try {
    // 모든 게시글 가져오기
    const posts = await getAllPosts();

    // 각 게시글의 조회수 가져오기
    const postsWithViews = await Promise.all(
      posts.map(async (post) => {
        const viewsKey = `post:${post.category}/${post.slug}:views`;
        const views = await redis.get(viewsKey);

        return {
          category: post.category,
          slug: post.slug,
          title: post.title,
          views: Number(views) || 0,
          date: post.date,
        };
      })
    );

    // 조회수 기준으로 정렬
    const sortedPosts = postsWithViews.sort((a, b) => b.views - a.views);

    return NextResponse.json(sortedPosts);
  } catch (error) {
    console.error("Error getting post views:", error);
    return NextResponse.error();
  }
}
