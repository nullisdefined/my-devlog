"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { TableOfContentsItem } from "@/types/index";
import { cn } from "@/lib/class-name-utils";
import { useHeaderStore } from "@/store/header-store";

interface TocProps {
  toc: TableOfContentsItem[] | null;
}

export function TableOfContents({ toc }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { setForceHidden } = useHeaderStore();
  const tocRef = useRef<HTMLDivElement>(null);

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

    const handleScroll = () => {
      if (!tocRef.current) return;

      const footerHeight = 200;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;

      const distanceToBottom = docHeight - (scrollY + windowHeight);

      if (distanceToBottom <= footerHeight) {
        const adjustment = footerHeight - distanceToBottom;
        tocRef.current.style.transform = `translateY(-${adjustment}px)`;
      } else {
        tocRef.current.style.transform = "translateY(0)";
      }
    };

    window.addEventListener("scroll", handleScroll);

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
      window.removeEventListener("scroll", handleScroll);
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

      if (window.innerWidth <= 767) {
        setIsExpanded(false);
      }
    }
  };

  return (
    <div
      ref={tocRef}
      className="sticky top-24 transition-transform duration-200"
    >
      <nav
        className={cn(
          "toc-container pb-8",
          isExpanded && "expanded",
          "max-h-[60vh] overflow-y-auto"
        )}
      >
        <p className="font-semibold mb-4 text-base hidden xl:block">Contents</p>
        {items.length > 0 && (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "text-sm transition-colors duration-200",
                  item.level === 2
                    ? "ml-0"
                    : item.level === 3
                    ? "ml-4"
                    : "ml-6",
                  activeId === item.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </div>
  );
}
