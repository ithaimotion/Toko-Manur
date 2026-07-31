"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@toko-manur/types";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { currentPage, totalPages } = meta;

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 mt-10"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {getPages().map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-slate-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
              currentPage === page
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:bg-primary-50 hover:text-primary"
            }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
