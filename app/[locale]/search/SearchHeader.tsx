"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Locale } from "@/lib/lang";

export default function SearchHeader({
  locale,
  dict,
  showFilters,
  setShowFilters,
}: {
  locale: Locale;
  dict: any;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  function handleResetFilters() {
    router.push(`/${locale}/search/`);
  }

  return (
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold dark:text-stone-100 uppercase tracking-tight">
        {dict.filter_title}
      </h3>
      <div className="flex gap-3 md:gap-5">
        {/* Clear filters button */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: -15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleResetFilters}
          className="btn text-[10px] text-stone-400 hover:text-viet-red transition-colors p-1 rounded-full cursor-pointer"
          title="Xóa bộ lọc"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-eraser"
          >
            <path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21" />
            <path d="m5.082 11.09 8.828 8.828" />
          </svg>
        </motion.button>

        {/* Toggle hide/show filters button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowFilters((prev) => !prev)}
          className="btn text-[10px] text-stone-400 hover:text-viet-red transition-colors p-1 rounded-full cursor-pointer"
          title={showFilters ? "Thu gọn bộ lọc" : "Mở rộng bộ lọc"}
        >
          {showFilters ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-eye-closed"
            >
              <path d="m15 18-.722-3.25" />
              <path d="M2 8a10.645 10.645 0 0 0 20 0" />
              <path d="m20 15-1.726-2.05" />
              <path d="m4 15 1.726-2.05" />
              <path d="m9 18 .722-3.25" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-eye"
            >
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </motion.button>
      </div>
    </div>
  );
}
