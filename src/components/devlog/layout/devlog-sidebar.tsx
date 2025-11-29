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
import {
  ChevronRight,
  Folder,
  BookOpen,
  Tag as TagIcon,
  FileText,
  LayoutGrid,
} from "lucide-react";

interface DevlogSidebarProps {
  posts: Post[];
  onLinkClick?: () => void;
}

export function DevlogSidebar({ posts, onLinkClick }: DevlogSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleCategoryClick = (
    category: CategoryItem,
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    setExpandedCategories((prev) =>
      prev.includes(category.path)
        ? prev.filter((path) => path !== category.path)
        : [...prev, category.path],
    );
  };

  // 카테고리별 글 개수 계산
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    posts.forEach((post) => {
      const postCategory =
        post.urlCategory?.toLowerCase() || post.category?.toLowerCase();
      if (postCategory) {
        // 정확한 카테고리 경로 매칭
        categories.forEach((category) => {
          const categoryPath = category.path
            .toLowerCase()
            .replace("/devlog/categories/", "");

          if (
            postCategory === categoryPath ||
            postCategory.startsWith(`${categoryPath}/`)
          ) {
            counts.set(category.path, (counts.get(category.path) || 0) + 1);
          }

          // 하위 카테고리도 체크
          if (category.subcategories) {
            category.subcategories.forEach((subcategory) => {
              const subcategoryPath = subcategory.path
                .toLowerCase()
                .replace("/devlog/categories/", "");

              if (
                postCategory === subcategoryPath ||
                postCategory.startsWith(`${subcategoryPath}/`)
              ) {
                counts.set(
                  subcategory.path,
                  (counts.get(subcategory.path) || 0) + 1,
                );
              }
            });
          }
        });
      }
    });

    return counts;
  }, [posts]);

  const allTagCounts = useMemo(() => {
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
      .map(([tag, count]) => ({
        name: tag,
        count: count,
      }));
  }, [posts]);

  const [showAllTags, setShowAllTags] = useState(false);

  const tagCounts = showAllTags ? allTagCounts : allTagCounts.slice(0, 10);

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
          <Link href="/" onClick={onLinkClick}>
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

        {/* All Posts */}
        <div>
          <Link
            href="/devlog"
            onClick={onLinkClick}
            className={cn(
              "flex items-center justify-between w-full px-2 py-2 rounded-md",
              "hover:bg-accent hover:text-accent-foreground",
              "transition-colors cursor-pointer group",
            )}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-semibold text-foreground">
                All Posts
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {posts.length}
              </span>
            </div>
          </Link>
        </div>

        <div className="border-t border-border/50" />

        {/* Categories */}
        <div>
          <h4 className="text-sm font-semibold mb-2 px-2 text-foreground flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Categories
          </h4>
          <nav className="space-y-0.5">
            {categories.map((category) => {
              const categoryCount = categoryCounts.get(category.path) || 0;

              return (
                <div key={category.path} className="space-y-0.5">
                  {category.subcategories &&
                  category.subcategories.length > 0 ? (
                    <div
                      className="group relative"
                      onClick={(e) => handleCategoryClick(category, e)}
                    >
                      <button
                        className={cn(
                          "flex items-center justify-between w-full px-2 py-1 rounded-md",
                          "hover:bg-accent hover:text-accent-foreground",
                          "transition-colors cursor-pointer font-medium text-foreground",
                        )}
                      >
                        <div className="flex items-center">
                          <ChevronRight
                            className={cn(
                              "h-3 w-3 transition-transform mr-2 text-muted-foreground group-hover:text-foreground",
                              expandedCategories.includes(category.path) &&
                                "rotate-90",
                            )}
                          />
                          <category.icon className="w-3 h-3 mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="text-sm font-semibold text-foreground">
                            {category.name}
                          </span>
                        </div>
                        {categoryCount > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {categoryCount}
                            </span>
                          </div>
                        )}
                      </button>
                    </div>
                  ) : (
                    <Link
                      href={category.path}
                      onClick={onLinkClick}
                      className={cn(
                        "flex items-center justify-between w-full px-2 py-1 rounded-md",
                        "hover:bg-accent hover:text-accent-foreground",
                        "transition-colors cursor-pointer group",
                      )}
                    >
                      <div className="flex items-center">
                        <div className="w-3 mr-2" />
                        <category.icon className="w-3 h-3 mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-semibold text-foreground">
                          {category.name}
                        </span>
                      </div>
                      {categoryCount > 0 && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {categoryCount}
                          </span>
                        </div>
                      )}
                    </Link>
                  )}

                  {category.subcategories &&
                    category.subcategories.length > 0 &&
                    expandedCategories.includes(category.path) && (
                      <div className="ml-6 space-y-0.5">
                        {category.subcategories.map((subcategory) => {
                          const subcategoryCount =
                            categoryCounts.get(subcategory.path) || 0;

                          return (
                            <Link
                              key={subcategory.path}
                              href={subcategory.path}
                              onClick={onLinkClick}
                              className={cn(
                                "flex items-center justify-between px-2 py-1 rounded-md",
                                "hover:bg-accent hover:text-accent-foreground",
                                "transition-colors text-xs relative group",
                              )}
                            >
                              <div className="flex items-center">
                                <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xs">
                                  └
                                </span>
                                <subcategory.icon className="w-3 h-3 mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span className="text-xs text-foreground">
                                  {subcategory.name}
                                </span>
                              </div>
                              {subcategoryCount > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-muted-foreground">
                                    {subcategoryCount}
                                  </span>
                                </div>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-border/50" />

        {/* Series */}
        <div>
          <h4 className="text-sm font-semibold mb-2 px-2 text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
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
                  onClick={onLinkClick}
                  className="group block px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between min-w-0">
                    <span className="truncate text-xs flex-1 text-foreground">
                      {series.name}
                    </span>
                    {postCount > 0 && (
                      <div className="flex items-center gap-1 ml-2">
                        <FileText className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-xs text-muted-foreground group-hover:text-primary whitespace-nowrap flex-shrink-0 transition-colors">
                          {postCount}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-border/50" />

        {/* Tags */}
        <div>
          <h4 className="text-sm font-semibold mb-2 px-2 text-foreground flex items-center gap-2">
            <TagIcon className="w-4 h-4" />
            Tags
          </h4>
          {tagCounts.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 px-2 items-center">
              {tagCounts.map(({ name, count }) => (
<Link
                  key={name}
                  href={`/devlog/tags/${encodeURIComponent(
                    name.toLowerCase()
                  )}`}
                  onClick={onLinkClick}
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
          {allTagCounts.length > 10 && (
            <div className="w-full flex justify-center mt-2">
              <button
                className="px-4 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:text-muted-foreground/80 transition-colors"
                onClick={() => setShowAllTags((show) => !show)}
                type="button"
              >
                {showAllTags ? "Show less" : "Show more"}
              </button>
            </div>
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
