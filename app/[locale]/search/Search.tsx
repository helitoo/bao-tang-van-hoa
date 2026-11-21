"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { useArtifact, type Artifact } from "@/contexts/artifact";
import { Locale } from "@/lib/lang";

import SearchPanelHeader from "@/app/[locale]/search/SearchHeader";
import SearchBody from "@/app/[locale]/search/SearchBody";
import SearchResult from "@/app/[locale]/search/SearchResult";
import { getFilteredArtifacts } from "@/app/[locale]/search/getFilteredArtifacts";

export default function Search({
  locale,
  dict,
  initQuery,
  initCats,
  initColor = "",
}: {
  locale: Locale;
  dict: any;
  initQuery: string;
  initCats: string[];
  initColor?: string;
}) {
  const router = useRouter();

  // Filters state
  const [query, setQuery] = useState<string>(initQuery);
  const [cats, setCats] = useState<string[]>(initCats);
  const [selectedColor, setSelectedColor] = useState<string>(initColor);

  // Hide / Show search panel
  const [showFilters, setShowFilters] = useState(true);

  const { artifacts } = useArtifact();

  const [filteredArtifacts, setFilteredArtifacts] = useState<
    Artifact[] | undefined
  >(artifacts);

  // Helper để đồng bộ URL tìm kiếm
  function syncUrl(q: string, c: string[], col: string) {
    const search = new URLSearchParams();
    if (q.trim()) search.set("query", q.trim());
    c.filter(Boolean).forEach((cat) => search.append("cats", cat));
    if (col.trim()) search.set("color", col.trim());

    const urlStr = search.toString() ? `?${search.toString()}` : `/${locale}/search`;
    router.replace(urlStr, { scroll: false });
  }

  // Cờ nhận diện lần render đầu tiên
  const isFirstRender = useRef(true);

  // Tự động lọc danh sách với debounce nhẹ (250ms) khi bất kỳ filter nào thay đổi (query, cats, color)
  useEffect(() => {
    if (!artifacts) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      setFilteredArtifacts(
        getFilteredArtifacts(query, cats, artifacts, locale, selectedColor),
      );
      return;
    }

    const timer = setTimeout(() => {
      setFilteredArtifacts(
        getFilteredArtifacts(query, cats, artifacts, locale, selectedColor),
      );
      syncUrl(query, cats, selectedColor);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, cats, selectedColor, artifacts, locale]);

  // Xử lý khi nhấn nút "Tìm kiếm ngay" hoặc nhấn Enter (cập nhật ngay lập tức không cần chờ debounce)
  function handleSearchSubmit() {
    if (!artifacts) return;
    syncUrl(query, cats, selectedColor);
    setFilteredArtifacts(
      getFilteredArtifacts(query, cats, artifacts, locale, selectedColor),
    );
  }

  function handleColorChange(newColor: string) {
    setSelectedColor(newColor);
  }

  return (
    <div className="w-full flex-shrink-0">
      <div className="bg-white dark:bg-stone-900 p-6 border border-stone-200 dark:border-stone-800 transition-colors duration-300">
        {/* Header */}
        <SearchPanelHeader
          locale={locale as Locale}
          dict={dict}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Animated Filter Body */}
        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <SearchBody
                locale={locale as Locale}
                dict={dict}
                query={query}
                setQuery={setQuery}
                cats={cats}
                setCats={setCats}
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
                handleSearchSubmit={handleSearchSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SearchResult
        locale={locale}
        dict={dict}
        filteredArtifacts={filteredArtifacts}
      />
    </div>
  );
}
