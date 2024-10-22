// src/components/devlog/pagination.tsx
import Link from "next/link";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={`/devlog?page=${currentPage - 1}`}
          className="bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md"
        >
          Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((page) => {
          // 현재 페이지 주변의 페이지만 보여주기
          return (
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1
          );
        })
        .map((page, i, arr) => (
          <React.Fragment key={page}>
            {i > 0 && arr[i - 1] !== page - 1 && (
              <span className="px-2">...</span>
            )}
            <Link
              href={`/devlog?page=${page}`}
              className={`${
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              } px-4 py-2 rounded-md`}
            >
              {page}
            </Link>
          </React.Fragment>
        ))}

      {currentPage < totalPages && (
        <Link
          href={`/devlog?page=${currentPage + 1}`}
          className="bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md"
        >
          Next
        </Link>
      )}
    </div>
  );
}
