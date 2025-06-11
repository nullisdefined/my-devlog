import { getPostBySlug, getPostList } from "@/lib/posts";
import { markdownToHtml, extractTableOfContents } from "@/lib/markdown";
import { notFound } from "next/navigation";
import { PostView } from "@/components/devlog/post-view";

interface PostPageProps {
  params: {
    slug: string[];
  };
  searchParams: {
    page?: string;
    order?: "asc" | "desc";
  };
}

// 포스트 내용에서 첫 150자 추출 (마크다운 제거)
function getPostExcerpt(post: any) {
  if (post.excerpt) return post.excerpt;

  const content = post.content || "";
  if (!content) return post.title;

  // 마크다운 문법 제거
  const cleanContent = content
    .replace(/#{1,6}\s+/g, "") // 헤딩 제거
    .replace(/\*\*(.*?)\*\*/g, "$1") // 볼드 제거
    .replace(/\*(.*?)\*/g, "$1") // 이탤릭 제거
    .replace(/`(.*?)`/g, "$1") // 인라인 코드 제거
    .replace(/```[\s\S]*?```/g, "") // 코드 블록 제거
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 링크 제거
    .replace(/\n+/g, " ") // 줄바꿈을 공백으로
    .trim();

  return cleanContent.slice(0, 150) + (cleanContent.length > 150 ? "..." : "");
}

export async function generateStaticParams() {
  const posts = await getPostList();

  return posts.map((post) => ({
    slug: [...(post.urlCategory?.split("/").filter(Boolean) || []), post.slug],
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const slug = params.slug[params.slug.length - 1];
  const category = params.slug.slice(0, -1).join("/");
  const post = await getPostBySlug(category.toLowerCase(), slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const canonicalPath = `https://nullisdefined.site/devlog/posts/${params.slug.join(
    "/"
  )}`;

  const description = getPostExcerpt(post);

  return {
    title: post.title,
    description: description,
    keywords: post.tags,
    authors: [{ name: "nullisdefined" }],
    creator: "nullisdefined",
    publisher: "nullisdefined",
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: post.title,
      description: description,
      url: canonicalPath,
      siteName: "Devlog",
      locale: "ko_KR",
      type: "article",
      publishedTime: post.date,
      authors: ["nullisdefined"],
      tags: post.tags,
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [
            {
              url: "/favicon.ico",
              width: 800,
              height: 600,
              alt: post.title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: post.thumbnail ? [post.thumbnail] : ["/favicon.ico"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function PostPage({
  params,
  searchParams,
}: PostPageProps) {
  const slug = params.slug[params.slug.length - 1];
  const category = params.slug.slice(0, -1).join("/");

  const post = await getPostBySlug(category.toLowerCase(), slug);

  if (!post) {
    notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const toc = extractTableOfContents(content);
  const description = getPostExcerpt(post);

  const canonicalPath = `https://nullisdefined.site/devlog/posts/${params.slug.join(
    "/"
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: description,
    image: post.thumbnail || "/favicon.ico",
    author: {
      "@type": "Person",
      name: "nullisdefined",
    },
    publisher: {
      "@type": "Person",
      name: "nullisdefined",
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalPath,
    },
    url: canonicalPath,
    keywords: post.tags?.join(", "),
    articleSection: post.category,
    inLanguage: "ko-KR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostView post={post} content={content} toc={toc} />
    </>
  );
}
