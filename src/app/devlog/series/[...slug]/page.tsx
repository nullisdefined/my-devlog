import { Metadata } from "next";
import { notFound } from "next/navigation";
import { seriesCategories, CategoryItem } from "@/config/categories";
import { SeriesView } from "@/components/devlog/series-view";
import { getSeriesPostList } from "@/lib/posts";
import { InfiniteScrollPosts } from "@/components/devlog/infinite-scroll-posts";

const BASE_URL = "https://nullisdefined.my";

const getSlugWithoutPrefix = (segments: string[]) =>
  segments
    .filter(Boolean)
    .filter((segment, index) =>
      index === 0 ? segment.toLowerCase() !== "series" : true,
    );

const buildSeriesPath = (slugSegments: string[]) =>
  `series/${slugSegments.join("/").toLowerCase()}`;

const findSeriesByPath = (path: string): CategoryItem | null => {
  for (const mainCategory of seriesCategories) {
    if (!mainCategory.subcategories) continue;
    for (const series of mainCategory.subcategories) {
      const normalizedPath = series.path.replace("/devlog/", "").toLowerCase();
      if (normalizedPath === path) {
        return series;
      }
    }
  }
  return null;
};

export async function generateStaticParams() {
  const seriesPosts = await getSeriesPostList();

  const seen = new Set<string>();
  const params: { slug: string[] }[] = [];

  seriesPosts.forEach((post) => {
    const segments = post.urlCategory?.split("/") ?? [];
    const slug = getSlugWithoutPrefix(
      segments.map((segment) => segment.toLowerCase()),
    );

    if (slug.length === 0) return;

    const key = slug.join("/");
    if (seen.has(key)) return;

    seen.add(key);
    params.push({ slug });
  });

  return params;
}

interface SeriesPageProps {
  params: { slug: string[] };
  searchParams?: {
    order?: "asc" | "desc";
  };
}

export async function generateMetadata({
  params,
}: Pick<SeriesPageProps, "params">): Promise<Metadata> {
  const slugSegments = params.slug.map((segment) => segment.toLowerCase());
  const seriesPath = buildSeriesPath(slugSegments);
  const canonicalUrl = `${BASE_URL}/devlog/${seriesPath}`;
  const currentSeries = findSeriesByPath(seriesPath);

  if (!currentSeries) {
    return {
      title: "시리즈를 찾을 수 없습니다 | 개발새발",
      description: "요청하신 시리즈를 찾을 수 없습니다.",
      alternates: { canonical: canonicalUrl },
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    };
  }

  const allSeriesPosts = await getSeriesPostList();
  const seriesPosts = allSeriesPosts.filter(
    (post) => post.urlCategory?.toLowerCase() === seriesPath,
  );

  if (seriesPosts.length === 0) {
    return {
      title: `${currentSeries.name} 시리즈 | 개발새발`,
      description: `${currentSeries.name} 시리즈의 글이 준비 중입니다.`,
      alternates: { canonical: canonicalUrl },
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    };
  }

  const description =
    currentSeries.description ||
    `${currentSeries.name} 시리즈의 최신 글 ${seriesPosts.length}개를 확인하세요.`;

  return {
    title: `${currentSeries.name} 시리즈 | 개발새발`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${currentSeries.name} 시리즈 | 개발새발`,
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
      title: `${currentSeries.name} 시리즈 | 개발새발`,
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

export default async function SeriesPage({
  params,
  searchParams,
}: SeriesPageProps) {
  const slugSegments = params.slug.map((segment) => segment.toLowerCase());
  const seriesPath = buildSeriesPath(slugSegments);
  const order = searchParams?.order || "desc";
  const allPosts = await getSeriesPostList();

  const seriesPosts = allPosts
    .filter((post) => post.urlCategory?.toLowerCase() === seriesPath)
    .sort((a, b) => {
      const comparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      return order === "asc" ? comparison : -comparison;
    });

  const currentSeries = findSeriesByPath(seriesPath);
  if (!currentSeries || seriesPosts.length === 0) {
    notFound();
  }

  const currentSeriesForClient = {
    name: currentSeries.name,
    path: currentSeries.path,
    iconName: currentSeries.icon.name,
    description: currentSeries.description,
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWorkSeries",
    name: `${currentSeries.name} 시리즈 | 개발새발`,
    description:
      currentSeries.description ||
      `${currentSeries.name} 시리즈에 포함된 글 모음`,
    url: `${BASE_URL}/devlog/${seriesPath}`,
    inLanguage: "ko-KR",
    creator: {
      "@type": "Person",
      name: "nullisdefined",
      url: `${BASE_URL}`,
    },
    hasPart: seriesPosts.slice(0, 10).map((post) => {
      const postUrl = `${BASE_URL}/devlog/posts/${post.urlCategory}/${post.slug}`;
      return {
        "@type": "BlogPosting",
        headline: post.title,
        datePublished: post.date,
        dateModified: post.date,
        url: postUrl,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postUrl,
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="space-y-8">
        <SeriesView
          currentSeries={currentSeriesForClient}
          currentPosts={seriesPosts}
          seriesPosts={seriesPosts}
          order={order}
          currentPage={1}
          totalPages={Math.ceil(seriesPosts.length / 10)}
          previous={null}
          next={null}
        />
        {/* <InfiniteScrollPosts
          initialPosts={seriesPosts.slice(0, 6)}
          allPosts={seriesPosts}
          order={order}
        /> */}
      </div>
    </>
  );
}
