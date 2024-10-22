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
      const offset = 80; // 헤더 아래 추가 여백

      window.scrollTo({
        top: element.offsetTop - headerHeight - offset,
        behavior: "smooth",
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="space-y-2 sticky top-20">
      <p className="font-semibold mb-4">목차</p>
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
