import { getAllPosts } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await getAllPosts();
  const siteUrl = "https://nullisdefined.site";
  const feedUrl = `${siteUrl}/feed.xml`;

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>개발새발</title>
    <description>소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그</description>
    <link>${siteUrl}/devlog</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
    <webMaster>nullisdefined@gmail.com (nullisdefined)</webMaster>
    <managingEditor>nullisdefined@gmail.com (nullisdefined)</managingEditor>
    <image>
      <url>${siteUrl}/favicon.ico</url>
      <title>개발새발</title>
      <link>${siteUrl}/devlog</link>
    </image>
    ${posts
      .slice(0, 20) // 최신 20개 포스트만
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <link>${siteUrl}/devlog/posts/${post.urlCategory}/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/devlog/posts/${post.urlCategory}/${
          post.slug
        }</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>nullisdefined@gmail.com (nullisdefined)</author>
      <category><![CDATA[${post.category}]]></category>
      ${post.tags
        ?.map((tag) => `<category><![CDATA[${tag}]]></category>`)
        .join("")}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
