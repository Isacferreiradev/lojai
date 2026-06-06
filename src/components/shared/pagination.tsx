"use client";

import { useFilters } from "@/hooks/use-filters";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const { setFilter } = useFilters();

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    setFilter("page", page);
  };

  // Generate page numbers (can expand to show ellipsis for very large sets, but simple matches the requirements)
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="cursor-pointer h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? "default" : "outline"}
          onClick={() => handlePageChange(p)}
          className="h-9 w-9 p-0 font-mono font-semibold cursor-pointer"
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="cursor-pointer h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
