"use client";

import { useEffect, useState } from "react";
import { TableOfContentsItem } from "@/types/post";
import { cn } from "@/lib/class-name-utils";
import { useHeaderStore } from "@/store/header-store";

interface TocProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");
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

    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // 헤더 숨기기
      setForceHidden(true);

      const offset = 24; // 최소한의 여백만 적용

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="space-y-2 sticky top-20">
      <p className="font-semibold mb-4 text-base">Contents</p>
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
