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
        className="flex items-center space-x-1 text-sm text-muted-foreground mb-4"
      >
        <ol className="flex items-center space-x-1">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground/60" />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors flex items-center"
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1" />}
                  {item.title}
                </Link>
              ) : (
                <span className="text-foreground font-medium">
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
