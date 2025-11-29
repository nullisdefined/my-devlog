import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [
    { title: "Home", href: "/" },
    { title: "Devlog", href: "/devlog" },
    ...items,
  ];

  // 구조화된 데이터 생성
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      item: item.href ? `https://nullisdefined.my${item.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="flex items-center space-x-1 text-sm text-muted-foreground mb-4 overflow-x-auto scrollbar-thin pb-2"
      >
        <ol className="flex items-center space-x-1 flex-nowrap min-w-min">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-center flex-shrink-0">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground/60 flex-shrink-0" />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors flex items-center whitespace-nowrap"
                >
                  {index === 0 && (
                    <Home className="w-4 h-4 mr-1 flex-shrink-0" />
                  )}
                  <span className="truncate max-w-[150px] md:max-w-none">
                    {item.title}
                  </span>
                </Link>
              ) : (
                <span className="text-foreground font-medium whitespace-nowrap truncate max-w-[200px] md:max-w-none">
                  {item.title}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
