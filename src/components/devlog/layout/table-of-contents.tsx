"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/class-name-utils";
import Link from "next/link";

interface TableOfContentsProps {
  items: Array<{
    id: string;
    title: string;
    level: number;
  }>;
}

export function TableOfContents({ items }: TableOfContentsProps) {
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

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [items]);

  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <div>
          <p className="font-semibold text-center pb-2">Contents</p>
          <nav className="text-sm">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "block py-1 hover:text-foreground transition-colors",
                  {
                    "pl-4": item.level === 2,
                    "pl-8": item.level === 3,
                    "text-foreground": activeId === item.id,
                    "text-muted-foreground": activeId !== item.id,
                  }
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
