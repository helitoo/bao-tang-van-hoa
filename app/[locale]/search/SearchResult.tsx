"use client";

import { useState, useEffect } from "react";

import type { Locale } from "@/lib/lang";

import ArtifactCard from "@/components/ArtifactCard";
import { Artifact } from "@/contexts/artifact";

const ITEMS_PER_PAGE = 32;

export default function SearchResult({
  locale,
  dict,
  filteredArtifacts,
}: {
  locale: Locale;
  dict: any;
  filteredArtifacts: Artifact[] | undefined;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = filteredArtifacts
    ? Math.ceil(filteredArtifacts.length / ITEMS_PER_PAGE)
    : 0;

  const paginatedArtifacts = filteredArtifacts
    ? filteredArtifacts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      )
    : [];

  const getPageNumbers = () => {
    if (totalPages <= 3) {
      const p: (number | string)[] = [];
      for (let i = 1; i <= totalPages; i++) p.push(i);
      return p;
    }
    let start = currentPage - 1;
    let end = currentPage + 1;
    if (start < 1) {
      start = 1;
      end = 3;
    } else if (end > totalPages) {
      end = totalPages;
      start = totalPages - 2;
    }
    const p: (number | string)[] = [];
    if (start > 1) p.push("...");
    for (let i = start; i <= end; i++) p.push(i);
    if (end < totalPages) p.push("...");
    return p;
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page
  useEffect(() => goToPage(1), [filteredArtifacts]);

  if (!filteredArtifacts) return <></>;

  return (
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-2 border-stone-200 dark:border-stone-800 pb-4 gap-4">
        <span className="text-stone-500 font-medium italic text-sm">
          {dict.found} {filteredArtifacts.length} {dict.artifacts}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-4">
        {paginatedArtifacts.map((item) => (
          <ArtifactCard key={item.id} item={item} locale={locale} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-1">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="btn size-8 border font-extrabold text-[10px] bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="First Page"
          >
            &laquo;
          </button>

          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-stone-400 dark:text-stone-600 font-extrabold select-none text-[10px]"
                >
                  ...
                </span>
              );
            }
            const pageNum = p as number;
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`btn size-8 border font-extrabold text-[10px] transition-colors ${
                  currentPage === pageNum
                    ? "bg-viet-red text-white border-viet-red"
                    : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="btn size-8 border font-extrabold text-[10px] bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Last Page"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}
