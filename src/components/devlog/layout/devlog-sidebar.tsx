import { useState, useMemo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { categories, CategoryItem } from "@/config/categories";
import { Tag } from "../tag";
import { Post } from "@/types/index";

interface DevlogSidebarProps {
  posts: Post[];
}

export function DevlogSidebar({ posts }: DevlogSidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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

  const renderCategory = (category: CategoryItem) => {
    const hasSubcategories =
      category.subcategories && category.subcategories.length > 0;
    const Icon = category.icon;

    return (
      <div key={category.path} className="w-full relative">
        <div
          className="flex items-center justify-between group"
          onMouseEnter={() => setExpandedCategory(category.path)}
          onMouseLeave={() => setExpandedCategory(null)}
        >
          <Link
            href={category.path}
            className="flex-1 px-3 py-2 text-sm rounded-md hover:bg-accent/50 transition-colors flex items-center gap-2 group-hover:text-primary"
          >
            <Icon className="w-5 h-5" />
            <span>{category.name}</span>
          </Link>
          {hasSubcategories && (
            <ChevronRight className="w-4 h-4 mr-2 text-muted-foreground transition-transform group-hover:text-primary group-hover:translate-x-0.5 duration-200" />
          )}
        </div>

        {hasSubcategories && expandedCategory === category.path && (
          <div
            className="absolute left-[calc(100%+0.2rem)] top-0 py-1"
            onMouseEnter={() => setExpandedCategory(category.path)}
            onMouseLeave={() => setExpandedCategory(null)}
          >
            <div className="absolute left-0 w-8 h-full top-0 -translate-x-full" />

            <div className="relative w-44 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg z-50">
              {category.subcategories?.map((subcat) => {
                const SubIcon = subcat.icon;
                return (
                  <Link
                    key={subcat.path}
                    href={subcat.path}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent/50 transition-colors hover:text-primary"
                  >
                    <SubIcon className="w-5 h-5" />
                    <span>{subcat.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sticky top-20 space-y-8 pb-16">
      {/* Profile Section */}
      <div className="flex flex-col items-center space-y-4">
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
          <p className="text-sm text-muted-foreground">Backend Developer</p>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold mb-4 px-3">Categories</h4>
        <nav className="space-y-1">
          {categories.map((category) => renderCategory(category))}
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
                href={`/devlog/tags/${encodeURIComponent(name.toLowerCase())}`}
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
          <p className="text-sm text-muted-foreground px-3">태그가 없습니다</p>
        )}
      </div>
    </div>
  );
}
