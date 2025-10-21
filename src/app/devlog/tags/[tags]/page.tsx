import { Metadata } from "next";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import { notFound } from "next/navigation";
import { TagView } from "@/components/devlog/tag-view";

const BASE_URL = "https://nullisdefined.my";

interface TagPageProps {
  params: {
    tags: string;
  };
  searchParams: {
    order?: "asc" | "desc";
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();

  return tags.map((tag) => ({
    tags: tag,
  }));
}

export async function generateMetadata({
  params,
}: Pick<TagPageProps, "params">): Promise<Metadata> {
  const decodedTag = decodeURIComponent(params.tags);
  const canonicalUrl = `${BASE_URL}/devlog/tags/${encodeURIComponent(decodedTag)}`;
  const taggedPosts = await getPostsByTag(decodedTag);

  if (taggedPosts.length === 0) {
    return {
      title: `${decodedTag} 태그를 찾을 수 없습니다 | 개발새발`,
      description: `${decodedTag} 태그와 관련된 글이 존재하지 않습니다.`,
      alternates: { canonical: canonicalUrl },
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    };
  }

  const description = `${decodedTag} 태그로 분류된 ${taggedPosts.length}개의 글을 확인하세요.`;

  return {
    title: `${decodedTag} 태그 | 개발새발`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${decodedTag} 태그 | 개발새발`,
      description,
      url: canonicalUrl,
      siteName: "개발새발",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/favicon.ico`,
          width: 1200,
          height: 630,
          alt: "개발새발 로고",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedTag} 태그 | 개발새발`,
      description,
      images: [`${BASE_URL}/favicon.ico`],
      creator: "@nullisdefined",
      site: "@nullisdefined",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const order = searchParams.order || "desc";
  const decodedTag = decodeURIComponent(params.tags);

  const taggedPosts = await getPostsByTag(decodedTag);

  if (taggedPosts.length === 0) {
    notFound();
  }

  const sortedPosts = [...taggedPosts].sort((a, b) => {
    const comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    return order === "asc" ? comparison : -comparison;
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${decodedTag} 태그 | 개발새발`,
    description: `${decodedTag} 태그와 관련된 글 모음`,
    url: `${BASE_URL}/devlog/tags/${encodeURIComponent(decodedTag)}`,
    inLanguage: "ko-KR",
    isPartOf: {
      "@type": "Blog",
      name: "개발새발",
      url: `${BASE_URL}/devlog`,
    },
    hasPart: sortedPosts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.date,
      dateModified: post.date,
      url: `${BASE_URL}/devlog/posts/${post.urlCategory}/${post.slug}`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/devlog/posts/${post.urlCategory}/${post.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TagView
        sortedPosts={sortedPosts}
        decodedTag={decodedTag}
        order={order}
      />
    </>
  );
}
