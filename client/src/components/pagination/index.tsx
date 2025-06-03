"use client";

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface PaginationProps {
  totalPages: number;
  onPageChange: (page: number) => void;
}

function TripsPagination({ totalPages, onPageChange }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageWindow = 2;

  function getPageNumbers() {
    const pages = [];
    pages.push(1);

    if (currentPage - pageWindow > 2) {
      pages.push("left-ellipsis");
    }

    for (
      let i = Math.max(2, currentPage - pageWindow);
      i <= Math.min(totalPages - 1, currentPage + pageWindow);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage + pageWindow < totalPages - 1) {
      pages.push("right-ellipsis");
    }

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => {
              setCurrentPage((prev) => Math.max(1, prev - 1))
              onPageChange(Math.max(1, currentPage - 1));
            }}
          />
        </PaginationItem>

        {getPageNumbers().map((item, idx) => (
          <PaginationItem key={idx}>
            {typeof item === "number" ? (
              <PaginationLink
                className="cursor-pointer"
                isActive={item === currentPage}
                onClick={() => {
                  setCurrentPage(item);
                  onPageChange(item);
                }}
              >
                {item}
              </PaginationLink>
            ) : (
              <span className="px-2 text-muted-foreground">...</span>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => {
              setCurrentPage((prev) => Math.min(totalPages, prev + 1));
              onPageChange(Math.min(totalPages, currentPage + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default TripsPagination;
