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
import BallWidget from "@/components/ball/ball-widget";

interface DevlogSidebarProps {
  posts: Post[];
}

export function DevlogSidebar({ posts }: DevlogSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleCategoryClick = (
    category: CategoryItem,
    event: React.MouseEvent
  ) => {
    if (category.subcategories && category.subcategories.length > 0) {
      event.preventDefault();
      setExpandedCategories((current) =>
        current.includes(category.path)
          ? current.filter((path) => path !== category.path)
          : [...current, category.path]
      );
    }
  };

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();

    posts.forEach((post) => {
      post.tags?.forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => ({
        name: tag,
        count: counts.get(tag) || 0,
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
    <div className="relative h-[calc(100vh-4rem)] overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <div className="space-y-4 py-2 px-4 min-h-full">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-2">
          <Link href="/">
            <Avatar className="h-32 w-32 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <AvatarImage
                src="https://storage.googleapis.com/hotsix-bucket/KakaoTalk_20241022_185833320.jpg"
                alt="Profile"
              />
              <AvatarFallback>JK</AvatarFallback>
            </Avatar>
          </Link>
          <div className="text-center">
            <h3 className="font-semibold">Jaewoo Kim</h3>
            <p className="text-sm text-muted-foreground">{/**/}</p>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold mb-4 px-3">Categories</h4>
          <nav className="space-y-1">
            {categories.map((category) => (
              <div key={category.path} className="space-y-1">
                {category.subcategories && category.subcategories.length > 0 ? (
                  <div
                    className="group relative"
                    onClick={(e) => handleCategoryClick(category, e)}
                  >
                    <button
                      className={cn(
                        "flex items-center w-full px-2 py-1.5 rounded-md",
                        "hover:bg-accent hover:text-accent-foreground",
                        "transition-colors cursor-pointer"
                      )}
                    >
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform mr-2",
                          expandedCategories.includes(category.path) &&
                            "rotate-90"
                        )}
                      />
                      <category.icon className="w-4 h-4 mr-2" />
                      <span>{category.name}</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href={category.path}
                    className={cn(
                      "flex items-center w-full px-2 py-1.5 rounded-md",
                      "hover:bg-accent hover:text-accent-foreground",
                      "transition-colors cursor-pointer"
                    )}
                  >
                    <div className="w-4 mr-2" />
                    <category.icon className="w-4 h-4 mr-2" />
                    <span>{category.name}</span>
                  </Link>
                )}

                {category.subcategories &&
                  category.subcategories.length > 0 &&
                  expandedCategories.includes(category.path) && (
                    <div className="ml-9 space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.path}
                          href={subcategory.path}
                          className={cn(
                            "flex items-center px-2 py-1.5 rounded-md",
                            "hover:bg-accent hover:text-accent-foreground",
                            "transition-colors text-sm"
                          )}
                        >
                          {subcategory.icon && (
                            <subcategory.icon className="w-4 h-4 mr-2" />
                          )}
                          <span>{subcategory.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t" />

        {/* Series */}
        <div>
          <h4 className="font-semibold mb-4 px-3">Series</h4>
          <nav className="space-y-1">
            {seriesCategories[0].subcategories?.map((series) => {
              const postCount =
                seriesCounts.get(series.path.toLowerCase()) || 0;

              return (
                <Link
                  key={series.path}
                  href={series.path}
                  className="group block px-3 py-2 rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-sm flex-1">
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

        <div className="border-t" />

        {/* Tags */}
        <div>
          <h4 className="font-semibold mb-4 px-3">Tags</h4>
          {tagCounts.length > 0 ? (
            <div className="flex flex-wrap gap-2 px-3">
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
                    className="group-hover:bg-accent"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground px-3">
              태그가 없습니다
            </p>
          )}
        </div>

        <div className="border-t" />

        {/* Visitors Widget */}
        <div>
          <h4 className="font-semibold mb-4 px-3">Visitors</h4>
          <div className="px-3">
            <VisitorsWidget />
          </div>
        </div>

        {/* <div className="border-t" /> */}

        {/* Ball Widget */}
        {/*
        <div>
          <div className="px-3">
            <BallWidget />
          </div>
        </div>
        */}

        {/* 하단 여백 */}
        <div className="h-20" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
