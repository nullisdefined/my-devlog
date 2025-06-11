"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  categories,
  seriesCategories,
  CategoryItem,
} from "@/config/categories";
import { Tag } from "../tag";
import { Post } from "@/types/index";
import { VisitorsWidget } from "@/components/visitor/visitors-widget";
import { cn } from "@/lib/class-name-utils";
import { ChevronRight } from "lucide-react";

interface DevlogSidebarProps {
  posts: Post[];
}

export function DevlogSidebar({ posts }: DevlogSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleCategoryClick = (
    category: CategoryItem,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    setExpandedCategories((prev) =>
      prev.includes(category.path)
        ? prev.filter((path) => path !== category.path)
        : [...prev, category.path]
    );
  };

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();

    posts.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag) => {
          counts.set(tag, (counts.get(tag) || 0) + 1);
        });
      }
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({
        name: tag,
        count: count,
      }));
  }, [posts]);

  const seriesCounts = useMemo(() => {
    const counts = new Map<string, number>();

    posts.forEach((post) => {
      if (post.category?.toLowerCase().startsWith("series/")) {
        const seriesPath = "/devlog/" + post.category.toLowerCase();
        counts.set(seriesPath, (counts.get(seriesPath) || 0) + 1);
      }
    });

    return counts;
  }, [posts]);

  return (
    <div className="relative w-full">
      <div className="space-y-3 px-1 min-h-full">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-2 py-0 pb-2 relative z-10">
          <Link href="/">
            <Avatar className="h-28 w-28 border-2 border-primary/20 hover:border-primary/40 transition-colors relative z-10">
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/164657817?v=4"
                alt="Profile"
              />
              <AvatarFallback className="text-foreground">JK</AvatarFallback>
            </Avatar>
          </Link>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-foreground">
              Jaewoo Kim
            </h3>
            <p className="text-xs text-muted-foreground">{/**/}</p>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-semibold mb-2 px-2 text-foreground">
            Categories
          </h4>
          <nav className="space-y-0.5">
            {categories.map((category) => (
              <div key={category.path} className="space-y-0.5">
                {category.subcategories && category.subcategories.length > 0 ? (
                  <div
                    className="group relative"
                    onClick={(e) => handleCategoryClick(category, e)}
                  >
                    <button
                      className={cn(
                        "flex items-center w-full px-2 py-1 rounded-md text-foreground",
                        "hover:bg-accent hover:text-accent-foreground",
                        "transition-colors cursor-pointer"
                      )}
                    >
                      <ChevronRight
                        className={cn(
                          "h-3 w-3 transition-transform mr-2 text-muted-foreground",
                          expandedCategories.includes(category.path) &&
                            "rotate-90"
                        )}
                      />
                      <category.icon className="w-3 h-3 mr-2 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {category.name}
                      </span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href={category.path}
                    className={cn(
                      "flex items-center w-full px-2 py-1 rounded-md text-foreground",
                      "hover:bg-accent hover:text-accent-foreground",
                      "transition-colors cursor-pointer"
                    )}
                  >
                    <div className="w-3 mr-2" />
                    <category.icon className="w-3 h-3 mr-2 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {category.name}
                    </span>
                  </Link>
                )}

                {category.subcategories &&
                  category.subcategories.length > 0 &&
                  expandedCategories.includes(category.path) && (
                    <div className="ml-6 space-y-0.5">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.path}
                          href={subcategory.path}
                          className={cn(
                            "flex items-center px-2 py-1 rounded-md text-foreground",
                            "hover:bg-accent hover:text-accent-foreground",
                            "transition-colors text-xs relative"
                          )}
                        >
                          <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xs">
                            └
                          </span>
                          {subcategory.icon && (
                            <subcategory.icon className="w-3 h-3 mr-2 text-muted-foreground" />
                          )}
                          <span className="text-xs text-foreground">
                            {subcategory.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-border/50" />

        {/* Series */}
        <div>
          <h4 className="text-sm font-semibold mb-2 px-2 text-foreground">
            Series
          </h4>
          <nav className="space-y-0.5 ml-2">
            {seriesCategories[0].subcategories?.map((series) => {
              const postCount =
                seriesCounts.get(series.path.toLowerCase()) || 0;

              return (
                <Link
                  key={series.path}
                  href={series.path}
                  className="group block px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-xs flex-1 text-foreground">
                      {series.name}
                    </span>
                    <span className="text-xs text-muted-foreground group-hover:text-primary whitespace-nowrap flex-shrink-0">
                      {postCount}개의 글
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-border/50" />

        {/* Tags */}
        <div>
          <h4 className="text-sm font-semibold mb-2 px-2 text-foreground">
            Tags
          </h4>
          {tagCounts.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 px-2">
              {tagCounts.map(({ name, count }) => (
                <Link
                  key={name}
                  href={`/devlog/tags/${encodeURIComponent(
                    name.toLowerCase()
                  )}`}
                  className="group"
                >
                  <Tag
                    name={`${name} (${count})`}
                    className="group-hover:bg-accent text-foreground text-xs"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground px-2">
              태그가 없습니다
            </p>
          )}
        </div>

        <div className="border-t border-border/50" />

        {/* Widgets Section */}
        <div className="space-y-3 px-2 py-1">
          <VisitorsWidget />
        </div>

        {/* Bottom padding for scroll */}
        <div className="h-6" />
      </div>
    </div>
  );
}
