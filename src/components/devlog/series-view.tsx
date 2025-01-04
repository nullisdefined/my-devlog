"use client";

import { Post } from "@/types/index";
import { PostCard } from "./post-card";
import { Pagination } from "./pagination";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SortButton } from "./sort-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as Icons from "lucide-react";
import { CategoryItem } from "@/config/categories";

interface SeriesViewProps {
  currentPosts: Post[];
  currentSeries: Omit<CategoryItem, "icon"> & { iconName: string };
  seriesPosts: Post[];
  order: "asc" | "desc";
  currentPage: number;
  totalPages: number;
  previous: CategoryItem | null;
  next: CategoryItem | null;
}

export function SeriesView({
  currentPosts,
  currentSeries,
  seriesPosts,
  order,
  currentPage,
  totalPages,
  previous,
  next,
}: SeriesViewProps) {
  // @ts-expect-error - Dynamic icon import from lucide-react can't be typed properly
  const Icon = Icons[currentSeries.iconName];

  return (
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
              {seriesPosts.length} {seriesPosts.length === 1 ? "Post" : "Posts"}{" "}
              found
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
  );
}
