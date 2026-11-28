"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import type { CollectionSummary } from "@/contexts/artifact";
import CollectionCard from "@/components/CollectionCard";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function CollectionClient({
  initialCollections,
  locale,
  dict,
}: {
  initialCollections: CollectionSummary[];
  locale: string;
  dict: any;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    setQuery(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm("");
    setQuery("");
  };

  const filteredCollections = useMemo(() => {
    if (!query) return initialCollections;
    const lower = query.toLowerCase();
    return initialCollections.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.description?.toLowerCase().includes(lower),
    );
  }, [initialCollections, query]);

  return (
    <div className="w-full space-y-8">
      {/* Search Header Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm p-4 md:p-6 shadow-xs max-w-2xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={dict.collection_search_placeholder || "Tìm kiếm bộ sưu tập theo tên..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-sm pl-4 pr-10 py-2 focus:outline-none focus:border-viet-red transition-colors text-sm font-medium shadow-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-viet-red text-xs p-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="btn bg-viet-red text-white px-5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-red-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.34-4.34" />
            </svg>
            <span className="hidden sm:inline">{dict.nav_search || "Tìm kiếm"}</span>
          </button>
        </form>

        <div className="mt-3 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
          <span>
            {dict.found || "Tìm thấy"} <strong>{filteredCollections.length}</strong> {dict.nav_collection || "bộ sưu tập"}
          </span>
          {query && (
            <span className="text-[11px] italic">
              Từ khóa: &quot;{query}&quot;
            </span>
          )}
        </div>
      </div>

      {/* Collections Grid */}
      {filteredCollections.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={query}
        >
          {filteredCollections.map((col) => (
            <motion.div key={col.id} variants={itemVariants} className="h-full">
              <CollectionCard item={col} locale={locale} dict={dict} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-16 text-center space-y-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm max-w-md mx-auto"
        >
          <div className="w-12 h-12 mx-auto text-stone-300 dark:text-stone-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.65 7.65a2 2 0 0 1 2.629-1.046l5.51 2.374a2 2 0 0 1 1.046 2.628l-3.957 9.184a2 2 0 0 1-2.628 1.046l-5.51-2.374a2 2 0 0 1-1.046-2.628z" />
              <path d="M18 7.777V4a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v10a2 2 0 0 0 1.137 1.805" />
              <path d="m8 4.389-4.364.809a2 2 0 0 0-1.602 2.33l1.822 9.833a2 2 0 0 0 2.331 1.602l2.542-.47" />
            </svg>
          </div>
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
            {dict.collection_not_found || "Không tìm thấy bộ sưu tập nào phù hợp."}
          </p>
          {query && (
            <button
              onClick={handleClear}
              className="text-xs text-viet-red hover:underline font-semibold"
            >
              {dict.clear_color || "Xóa bộ lọc tìm kiếm"}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
