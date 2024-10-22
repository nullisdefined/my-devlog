"use client";

import { useEffect, useState } from "react";
import { TableOfContentsItem } from "@/types/post";
import { cn } from "@/lib/class-name-utils";

interface TocProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");

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

    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const header = document.querySelector("header");
      const headerHeight = header?.offsetHeight || 0;
      const offset = headerHeight + 100;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="space-y-2">
      <div className="border-b border-border pb-2 mb-4">
        <p className="font-semibold text-lg">Contents</p>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "transition-colors duration-200",
              // 레벨에 따른 들여쓰기와 글자 크기
              item.level === 2
                ? "ml-0 text-sm font-medium"
                : item.level === 3
                ? "ml-4 text-[13px]"
                : "ml-6 text-xs",
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
