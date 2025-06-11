"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { TableOfContentsItem } from "@/types/index";
import { cn } from "@/lib/class-name-utils";
import { useHeaderStore } from "@/store/header-store";
import { Menu } from "lucide-react";

interface TocProps {
  toc: TableOfContentsItem[] | null;
}

export function TableOfContents({ toc }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { setForceHidden } = useHeaderStore();

  const items = toc || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    const headings = document.querySelectorAll("h2, h3, h4");
    headings.forEach((elem) => observer.observe(elem));

    const handleTocClick = (e: Event) => {
      if (window.innerWidth <= 767) {
        const target = e.target as HTMLElement;
        if (!target.closest("a")) {
          setIsExpanded((prev) => !prev);
        }
      }
    };

    const tocContainer = document.querySelector(".toc-container");
    tocContainer?.addEventListener("click", handleTocClick);

    return () => {
      observer.disconnect();
      tocContainer?.removeEventListener("click", handleTocClick);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id); // 클릭시 즉시 활성 상태 설정
    const element = document.getElementById(id);
    if (element) {
      setForceHidden(true);
      const offset = 24;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      if (window.innerWidth <= 767) {
        setIsExpanded(false);
      }
    }
  };

  if (!items.length) return null;

  return (
    <div className="w-full h-full">
      <nav
        className={cn(
          "toc-container",
          isExpanded && "expanded",
          "w-full h-full overflow-y-auto scrollbar-thin"
        )}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-center gap-2 mb-3 pb-3 pt-14 border-b border-border/30">
          <Menu className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium text-sm text-foreground hidden lg:block">
            목차
          </h3>
        </div>

        {/* 목차 리스트 */}
        <ul className="space-y-1 px-4 pb-8">
          {items.map((item, index) => (
            <li
              key={item.id}
              className={cn(
                "transition-all duration-200",
                item.level === 2 ? "ml-0" : item.level === 3 ? "ml-3" : "ml-6"
              )}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  "block px-2 py-1.5 rounded-md transition-all duration-200",
                  "text-sm leading-relaxed text-left",
                  "hover:bg-accent/30",
                  "relative",
                  activeId === item.id
                    ? "text-primary font-medium bg-primary/5"
                    : "text-muted-foreground hover:text-foreground",
                  item.level === 2 && "font-medium",
                  item.level === 3 && "text-sm",
                  item.level === 4 && "text-xs"
                )}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
