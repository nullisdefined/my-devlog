import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  try {
    const posts = await getAllPosts();

    // 최신 글 1개만 반환
    const latestPost = posts[0];

    if (!latestPost) {
      return NextResponse.json({ post: null });
    }

    return NextResponse.json({
      post: {
        title: latestPost.title,
        slug: latestPost.slug,
        urlCategory: latestPost.urlCategory,
        url: `/devlog/posts/${latestPost.urlCategory}/${latestPost.slug}`,
      },
    });
  } catch (error) {
    console.error("Error fetching latest post:", error);
    return NextResponse.json({ post: null }, { status: 500 });
  }
}
