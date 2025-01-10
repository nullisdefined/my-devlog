import { notFound } from "next/navigation";
import { seriesCategories } from "@/config/categories";
import { SeriesView } from "@/components/devlog/series-view";
import { getSeriesPostList } from "@/lib/posts";
import { InfiniteScrollPosts } from "@/components/devlog/infinite-scroll-posts";

export async function generateStaticParams() {
  const seriesPosts = await getSeriesPostList();

  return seriesPosts.map((post) => ({
    slug: post.urlCategory?.split("/").filter(Boolean) || [],
  }));
}

interface SeriesPageProps {
  params: { slug: string[] };
  searchParams?: {
    order?: "asc" | "desc";
  };
}

export default async function SeriesPage({
  params,
  searchParams,
}: SeriesPageProps) {
  const seriesPath = `series/${params.slug.join("/")}`.toLowerCase();
  const order = searchParams?.order || "desc";
  const allPosts = await getSeriesPostList();

  const seriesPosts = allPosts
    .filter((post) => {
      const postCategory = post.urlCategory?.toLowerCase();
      return postCategory === seriesPath;
    })
    .sort((a, b) => {
      const comparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      return order === "asc" ? comparison : -comparison;
    });

  const findSeries = () => {
    for (const mainCategory of seriesCategories) {
      for (const series of mainCategory.subcategories || []) {
        const seriesPathInConfig = series.path
          .replace("/devlog/", "")
          .toLowerCase();
        if (seriesPathInConfig === seriesPath) {
          return series;
        }
      }
    }
    return null;
  };

  const currentSeries = findSeries();
  if (!currentSeries || seriesPosts.length === 0) {
    notFound();
  }

  const currentSeriesForClient = {
    name: currentSeries.name,
    path: currentSeries.path,
    iconName: currentSeries.icon.name,
    description: currentSeries.description,
  };

  return (
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
  );
}
