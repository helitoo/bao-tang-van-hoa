"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import type { Locale } from "@/lib/lang";

import ArtifactCard from "@/components/ArtifactCard";
import { Artifact } from "@/contexts/artifact";

const ITEMS_PER_PAGE = 32;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

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
  const resultsRef = useRef<HTMLDivElement>(null);

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

  // Chuyển trang khi người dùng chủ động bấm phân trang: đổi trang & cuộn mượt đến đầu kết quả
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Khi bộ lọc/từ khóa thay đổi: CHỈ reset trang về 1 trong yên lặng, TUYỆT ĐỐI KHÔNG cuộn trang
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredArtifacts]);

  if (!filteredArtifacts) return <></>;

  return (
    <div ref={resultsRef} className="flex-1 scroll-mt-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-2 border-stone-200 dark:border-stone-800 pb-4 gap-4">
        <span className="text-stone-500 font-medium italic text-sm">
          {dict.found} {filteredArtifacts.length} {dict.artifacts}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-4"
        >
          {paginatedArtifacts.map((item) => (
            <motion.div key={item.id} variants={itemVariants} className="h-full">
              <ArtifactCard item={item} locale={locale} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-1">
          <button
            onClick={() => handlePageChange(1)}
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
                onClick={() => handlePageChange(pageNum)}
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
            onClick={() => handlePageChange(totalPages)}
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
