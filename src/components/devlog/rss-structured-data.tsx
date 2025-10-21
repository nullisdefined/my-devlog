import { Post } from "@/types";

interface RSSStructuredDataProps {
  posts: Post[];
  feedType?: "main" | "category" | "tag" | "series";
  identifier?: string;
}

export function RSSStructuredData({
  posts,
  feedType = "main",
  identifier,
}: RSSStructuredDataProps) {
  const baseUrl = "https://nullisdefined.my";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name:
      feedType === "main" ? "개발새발" : `개발새발 - ${identifier} ${feedType}`,
    description:
      feedType === "main"
        ? "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그"
        : `${identifier} ${feedType}에 관한 글들`,
    url: `${baseUrl}/devlog`,
    author: {
      "@type": "Person",
      name: "nullisdefined",
      email: "nullisdefined@gmail.com",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "개발새발",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon.ico`,
      },
    },
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SubscribeAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/feed.xml`,
        encodingType: "application/rss+xml",
      },
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      url: `${baseUrl}/devlog/posts/${post.urlCategory}/${post.slug}`,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        "@type": "Person",
        name: "nullisdefined",
      },
      publisher: {
        "@type": "Organization",
        name: "개발새발",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}/devlog/posts/${post.urlCategory}/${post.slug}`,
      },
      image: post.thumbnail
        ? {
            "@type": "ImageObject",
            url: post.thumbnail,
          }
        : undefined,
      keywords: post.tags?.join(", "),
      articleSection: post.category,
      wordCount: post.content.split(" ").length,
      timeRequired: `PT${Math.ceil(post.content.split(" ").length / 200)}M`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}
