import Link from "next/link";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-3 mt-8">
      <Link
        href={`/devlog?page=${currentPage - 1}`}
        className={`text-muted-foreground hover:text-primary p-1.5 rounded-full transition-all hover:bg-primary/10 ${
          currentPage <= 1 ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((page) => {
          return (
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1
          );
        })
        .map((page, i, arr) => (
          <React.Fragment key={page}>
            {i > 0 && arr[i - 1] !== page - 1 && (
              <span className="text-muted-foreground px-2">•••</span>
            )}
            <Link
              href={`/devlog?page=${page}`}
              className={`${
                currentPage === page
                  ? "text-white bg-primary hover:bg-primary/90 dark:text-gray-800"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              } w-8 h-8 flex items-center justify-center rounded-full transition-all`}
            >
              {page}
            </Link>
          </React.Fragment>
        ))}

      <Link
        href={`/devlog?page=${currentPage + 1}`}
        className={`text-muted-foreground hover:text-primary p-1.5 rounded-full transition-all hover:bg-primary/10 ${
          currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
