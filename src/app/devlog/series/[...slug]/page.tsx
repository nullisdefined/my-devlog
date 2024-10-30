import { Post } from "@/types/index";
import { getSeriesPostList } from "@/lib/posts";
import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/devlog/post-card";
import { Pagination } from "@/components/devlog/pagination";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SortButton } from "@/components/devlog/sort-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { seriesCategories } from "@/config/categories";

export async function generateStaticParams() {
  const seriesPosts = await getSeriesPostList();
  return seriesPosts.map((post) => ({
    slug: post.urlCategory?.split("/") || [],
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

  const Icon = currentSeries.icon;
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
    <DevlogLayout posts={allPosts}>
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3">
              <Icon className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">{currentSeries.name}</h1>
            </div>
            {currentSeries.description && (
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/5 shadow-md">
                <div className="flex items-center justify-center gap-4">
                  <p className="text-md text-muted-foreground leading-relaxed text-center font-semibold">
                    {currentSeries.description}
                  </p>
                  <Quote className="w-4 h-4 text-primary/60 flex-shrink-0" />
                </div>
              </Card>
            )}

            <div className="flex items-center justify-between">
              <p className="text-muted-foreground font-medium">
                {seriesPosts.length}{" "}
                {seriesPosts.length === 1 ? "Post" : "Posts"} found
              </p>
              <SortButton order={order} />
            </div>
          </div>
        </div>

        {seriesPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              {currentPosts.map((post: Post) => (
                <PostCard
                  key={`${post.urlCategory}/${post.slug}`}
                  post={{
                    ...post,
                    category: currentSeries.name,
                  }}
                />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            아직 작성된 포스트가 없습니다.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {previous && (
            <Link href={previous.path} className="col-start-1">
              <Button variant="ghost" className="w-full group">
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">
                      Previous Series
                    </p>
                    <p className="font-medium truncate">{previous.name}</p>
                  </div>
                </div>
              </Button>
            </Link>
          )}
          {next && (
            <Link href={next.path} className="col-start-2">
              <Button variant="ghost" className="w-full group">
                <div className="flex items-center gap-2 justify-end">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Next Series</p>
                    <p className="font-medium truncate">{next.name}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </DevlogLayout>
  );
}
