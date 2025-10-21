import { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, CategoryItem } from "@/config/categories";
import { CategoryView } from "@/components/devlog/category-view";
import { getPostList } from "@/lib/posts";
import { InfiniteScrollPosts } from "@/components/devlog/infinite-scroll-posts";

const BASE_URL = "https://nullisdefined.my";

const normalizeCategoryPath = (path: string) =>
  path.replace("/devlog/categories/", "").replace(/^\/+|\/+$/g, "").toLowerCase();

const getSlugSegments = (category: string) =>
  normalizeCategoryPath(category)
    .split("/")
    .filter(Boolean);

const findCategoryByPath = (path: string): CategoryItem | null => {
  const search = (items: readonly CategoryItem[]): CategoryItem | null => {
    for (const item of items) {
      const itemPath = normalizeCategoryPath(item.path);
      if (itemPath === path) {
        return item;
      }
      if (item.subcategories) {
        const match = search(item.subcategories);
        if (match) return match;
      }
    }
    return null;
  };

  return search(categories);
};

export async function generateStaticParams() {
  const paths: { slug: string[] }[] = [];

  categories.forEach((cat) => {
    paths.push({ slug: getSlugSegments(cat.path) });
    cat.subcategories?.forEach((subcat) => {
      paths.push({ slug: getSlugSegments(subcat.path) });
    });
  });

  return paths;
}

interface CategoryPageParams {
  params: { slug: string[] };
  searchParams: {
    order?: "asc" | "desc";
  };
}

export async function generateMetadata({
  params,
}: Pick<CategoryPageParams, "params">): Promise<Metadata> {
  const categoryPath = params.slug.join("/").toLowerCase();
  const currentCategory = findCategoryByPath(categoryPath);
  const canonicalUrl = `${BASE_URL}/devlog/categories/${categoryPath}`;

  if (!currentCategory) {
    return {
      title: "카테고리를 찾을 수 없습니다 | 개발새발",
      description: "요청하신 카테고리를 찾을 수 없습니다.",
      alternates: { canonical: canonicalUrl },
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    };
  }

  const allPosts = await getPostList();
  const categoryPosts = allPosts.filter((post) => {
    const postCategory =
      post.urlCategory?.toLowerCase() || post.category?.toLowerCase();
    return categoryPath === "all"
      ? true
      : postCategory === categoryPath ||
          postCategory?.startsWith(`${categoryPath}/`);
  });

  if (categoryPosts.length === 0) {
    return {
      title: `${currentCategory.name} 카테고리 | 개발새발`,
      description: `${currentCategory.name} 카테고리의 글이 준비 중입니다.`,
      alternates: { canonical: canonicalUrl },
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    };
  }

  const description =
    currentCategory.description ||
    `${currentCategory.name} 카테고리의 최신 글 ${categoryPosts.length}개를 확인하세요.`;

  return {
    title: `${currentCategory.name} 카테고리 | 개발새발`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${currentCategory.name} 카테고리 | 개발새발`,
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
      title: `${currentCategory.name} 카테고리 | 개발새발`,
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

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageParams) {
  const categoryPath = params.slug.join("/").toLowerCase();
  const allPosts = await getPostList();
  const order = searchParams.order || "desc";

  const categoryPosts = allPosts
    .filter((post) => {
      const postCategory =
        post.urlCategory?.toLowerCase() || post.category?.toLowerCase();
      return categoryPath === "all"
        ? true
        : postCategory === categoryPath ||
            postCategory?.startsWith(`${categoryPath}/`);
    })
    .sort((a, b) => {
      const comparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      return order === "asc" ? comparison : -comparison;
    });

  const currentCategory = findCategoryByPath(categoryPath);

  if (!currentCategory || categoryPosts.length === 0) {
    notFound();
  }

  const categoryForClient = {
    name: currentCategory.name,
    path: currentCategory.path,
    iconName: currentCategory.icon.name,
    description: currentCategory.description,
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${currentCategory.name} 카테고리 | 개발새발`,
    description:
      currentCategory.description ||
      `${currentCategory.name} 카테고리에 포함된 글 모음`,
    url: `${BASE_URL}/devlog/categories/${categoryPath}`,
    inLanguage: "ko-KR",
    isPartOf: {
      "@type": "Blog",
      name: "개발새발",
      url: `${BASE_URL}/devlog`,
    },
    hasPart: categoryPosts.slice(0, 10).map((post) => {
      const postPath = post.urlCategory
        ? `${post.urlCategory}/${post.slug}`
        : `${categoryPath}/${post.slug}`;
      const postUrl = `${BASE_URL}/devlog/posts/${postPath}`;
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
        <CategoryView
          posts={categoryPosts}
          allPosts={allPosts}
          currentCategory={categoryForClient}
          order={order}
          categoryPosts={categoryPosts}
          currentPage={1}
          totalPages={Math.ceil(categoryPosts.length / 10)}
        />
        {/* <InfiniteScrollPosts
          initialPosts={categoryPosts.slice(0, 6)}
          allPosts={categoryPosts}
          order={order}
        /> */}
      </div>
    </>
  );
}
