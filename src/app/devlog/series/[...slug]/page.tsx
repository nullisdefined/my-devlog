import { notFound } from "next/navigation";
import { seriesCategories } from "@/config/categories";
import { SeriesView } from "@/components/devlog/series-view";
import { getSeriesPostList } from "@/lib/posts";

export async function generateStaticParams() {
  const seriesPosts = await getSeriesPostList();

  return seriesPosts.map((post) => ({
    slug: post.urlCategory?.split("/").filter(Boolean) || [],
  }));
}

export default async function SeriesPage({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: {
    page?: string;
    order?: "asc" | "desc";
  };
}) {
  const seriesPath = `series/${params.slug.join("/")}`.toLowerCase();
  const order = searchParams.order || "desc";
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
  if (!currentSeries) {
    notFound();
  }

  const currentSeriesWithIconName = {
    ...currentSeries,
    iconName: currentSeries.icon.name,
  };

  const currentPage = Number(searchParams.page) || 1;
  const postsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(seriesPosts.length / postsPerPage));

  const currentPosts = seriesPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const findAdjacentSeries = () => {
    const allSeries = seriesCategories[0].subcategories || [];
    const currentIndex = allSeries.findIndex(
      (series) =>
        series.path.replace("/devlog/", "").toLowerCase() === seriesPath
    );

    return {
      previous: currentIndex > 0 ? allSeries[currentIndex - 1] : null,
      next:
        currentIndex < allSeries.length - 1
          ? allSeries[currentIndex + 1]
          : null,
    };
  };

  const { previous, next } = findAdjacentSeries();

  return (
    <SeriesView
      currentPosts={currentPosts}
      currentSeries={currentSeriesWithIconName}
      seriesPosts={seriesPosts}
      order={order}
      currentPage={currentPage}
      totalPages={totalPages}
      previous={previous}
      next={next}
    />
  );
}
