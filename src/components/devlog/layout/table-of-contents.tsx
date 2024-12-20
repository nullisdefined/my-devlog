"use client";

import { useEffect, useState } from "react";
import { TableOfContentsItem } from "@/types/index";
import { cn } from "@/lib/class-name-utils";
import { useHeaderStore } from "@/store/header-store";

interface TocProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { setForceHidden } = useHeaderStore();

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

    // 모바일에서 TOC 토글 기능
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

      // 모바일에서 TOC 닫기
      if (window.innerWidth <= 767) {
        setIsExpanded(false);
      }
    }
  };

  return (
    <nav className={cn("toc-container", isExpanded && "expanded")}>
      <p className="font-semibold mb-4 text-base hidden xl:block">Contents</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "text-sm transition-colors duration-200",
              item.level === 2 ? "ml-0" : item.level === 3 ? "ml-4" : "ml-6",
              activeId === item.id
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
