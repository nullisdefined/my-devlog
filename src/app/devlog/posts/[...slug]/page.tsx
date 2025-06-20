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

  return cleanContent.slice(0, 160) + (cleanContent.length > 160 ? "..." : "");
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
      title: "Post Not Found | 개발새발",
      description: "요청하신 포스트를 찾을 수 없습니다.",
    };
  }

  const canonicalPath = `https://nullisdefined.site/devlog/posts/${params.slug.join(
    "/"
  )}`;

  const description = getPostExcerpt(post);

  return {
    title: `${post.title} | 개발새발`,
    description: description,
    keywords: post.tags,
    authors: [{ name: "nullisdefined", url: "https://nullisdefined.site" }],
    creator: "nullisdefined",
    publisher: "nullisdefined",
    category: post.category || "Technology",
    alternates: {
      canonical: canonicalPath,
    },
    verification: {
      google: "ff3317b463f80ded",
      other: {
        "naver-site-verification": "acc1996a3ef10bb25b7449629e79dcb2",
      },
    },
    openGraph: {
      title: post.title,
      description: description,
      url: canonicalPath,
      siteName: "개발새발",
      locale: "ko_KR",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ["nullisdefined"],
      section: post.category,
      tags: post.tags,
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail.startsWith("http")
                ? post.thumbnail
                : `https://nullisdefined.site${post.thumbnail}`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [
            {
              url: "https://nullisdefined.site/favicon.ico",
              width: 800,
              height: 600,
              alt: post.title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@nullisdefined",
      creator: "@nullisdefined",
      title: post.title,
      description: description,
      images: post.thumbnail
        ? [
            post.thumbnail.startsWith("http")
              ? post.thumbnail
              : `https://nullisdefined.site${post.thumbnail}`,
          ]
        : ["https://nullisdefined.site/favicon.ico"],
    },
    robots: {
      index: true,
      follow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "google-site-verification": "ff3317b463f80ded",
      "naver-site-verification": "acc1996a3ef10bb25b7449629e79dcb2",
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

  // 개선된 JSON-LD 구조화된 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalPath,
    },
    headline: post.title,
    description: description,
    image: post.thumbnail
      ? post.thumbnail.startsWith("http")
        ? post.thumbnail
        : `https://nullisdefined.site${post.thumbnail}`
      : "https://nullisdefined.site/favicon.ico",
    author: {
      "@type": "Person",
      name: "nullisdefined",
      url: "https://nullisdefined.site",
    },
    publisher: {
      "@type": "Organization",
      name: "개발새발",
      url: "https://nullisdefined.site",
      logo: {
        "@type": "ImageObject",
        url: "https://nullisdefined.site/favicon.ico",
        width: 60,
        height: 60,
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    url: canonicalPath,
    keywords: post.tags?.join(", "),
    articleSection: post.category,
    inLanguage: "ko-KR",
    isAccessibleForFree: true,
    about: {
      "@type": "Thing",
      name: post.category,
    },
    wordCount: post.content ? post.content.split(" ").length : 0,
  };

  // BreadcrumbList 구조화된 데이터
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: "https://nullisdefined.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "개발새발",
        item: "https://nullisdefined.site/devlog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.category,
        item: `https://nullisdefined.site/devlog/categories/${category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: canonicalPath,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PostView post={post} content={content} toc={toc} />
    </>
  );
}
