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
  initExcludeCats = [],
  initColors = [],
  initExcludeColors = [],
  initColor = "",
}: {
  locale: Locale;
  dict: any;
  initQuery: string;
  initCats: string[];
  initExcludeCats?: string[];
  initColors?: string[];
  initExcludeColors?: string[];
  initColor?: string;
}) {
  const router = useRouter();

  // Khởi tạo colors từ initColors hoặc fallback initColor
  const parsedInitColors =
    initColors.length > 0
      ? initColors
      : initColor
      ? [initColor]
      : [];

  // Filters state
  const [query, setQuery] = useState<string>(initQuery);
  const [cats, setCats] = useState<string[]>(initCats);
  const [excludeCats, setExcludeCats] = useState<string[]>(initExcludeCats);
  const [colors, setColors] = useState<string[]>(parsedInitColors);
  const [excludeColors, setExcludeColors] = useState<string[]>(initExcludeColors);

  // Hide / Show search panel
  const [showFilters, setShowFilters] = useState(true);

  const { artifacts } = useArtifact();

  const [filteredArtifacts, setFilteredArtifacts] = useState<
    Artifact[] | undefined
  >(artifacts);

  // Helper để đồng bộ URL tìm kiếm
  function syncUrl(
    q: string,
    c: string[],
    exc: string[],
    cols: string[],
    excCols: string[],
  ) {
    const search = new URLSearchParams();
    if (q.trim()) search.set("query", q.trim());
    c.filter(Boolean).forEach((cat) => search.append("cats", cat));
    exc.filter(Boolean).forEach((cat) => search.append("excludeCats", cat));
    cols.filter(Boolean).forEach((col) => search.append("colors", col));
    excCols.filter(Boolean).forEach((col) => search.append("excludeColors", col));

    const urlStr = search.toString() ? `?${search.toString()}` : `/${locale}/search`;
    router.replace(urlStr, { scroll: false });
  }

  // Toggle category mode: none -> include -> exclude -> none -> include
  function handleToggleCategory(id: string) {
    if (cats.includes(id)) {
      // include -> exclude
      setCats((prev) => prev.filter((c) => c !== id));
      setExcludeCats((prev) => [...prev.filter((c) => c !== id), id]);
    } else if (excludeCats.includes(id)) {
      // exclude -> none
      setExcludeCats((prev) => prev.filter((c) => c !== id));
    } else {
      // none -> include
      setCats((prev) => [...prev.filter((c) => c !== id), id]);
    }
  }

  // Toggle color mode: none -> include -> exclude -> none -> include
  function handleToggleColor(
    hex: string,
    forceMode?: "include" | "exclude" | "none",
  ) {
    const normalized = hex.toLowerCase();
    const isIncluded = colors.some((c) => c.toLowerCase() === normalized);
    const isExcluded = excludeColors.some((c) => c.toLowerCase() === normalized);

    if (forceMode === "include") {
      setExcludeColors((prev) =>
        prev.filter((c) => c.toLowerCase() !== normalized),
      );
      if (!isIncluded) {
        setColors((prev) => [
          ...prev.filter((c) => c.toLowerCase() !== normalized),
          hex,
        ]);
      }
      return;
    }

    if (isIncluded) {
      // include -> exclude
      setColors((prev) => prev.filter((c) => c.toLowerCase() !== normalized));
      setExcludeColors((prev) => [
        ...prev.filter((c) => c.toLowerCase() !== normalized),
        hex,
      ]);
    } else if (isExcluded) {
      // exclude -> none
      setExcludeColors((prev) =>
        prev.filter((c) => c.toLowerCase() !== normalized),
      );
    } else {
      // none -> include
      setColors((prev) => [
        ...prev.filter((c) => c.toLowerCase() !== normalized),
        hex,
      ]);
    }
  }

  function handleClearColors() {
    setColors([]);
    setExcludeColors([]);
  }

  // Reset filters
  function handleResetFilters() {
    setQuery("");
    setCats([]);
    setExcludeCats([]);
    setColors([]);
    setExcludeColors([]);
    syncUrl("", [], [], [], []);
  }

  // Cờ nhận diện lần render đầu tiên
  const isFirstRender = useRef(true);

  // Tự động lọc danh sách với debounce nhẹ (250ms) khi bất kỳ filter nào thay đổi
  useEffect(() => {
    if (!artifacts) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      setFilteredArtifacts(
        getFilteredArtifacts(
          query,
          cats,
          artifacts,
          locale,
          colors,
          excludeCats,
          excludeColors,
        ),
      );
      return;
    }

    const timer = setTimeout(() => {
      setFilteredArtifacts(
        getFilteredArtifacts(
          query,
          cats,
          artifacts,
          locale,
          colors,
          excludeCats,
          excludeColors,
        ),
      );
      syncUrl(query, cats, excludeCats, colors, excludeColors);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, cats, excludeCats, colors, excludeColors, artifacts, locale]);

  // Xử lý khi nhấn nút "Tìm kiếm ngay" hoặc nhấn Enter
  function handleSearchSubmit() {
    if (!artifacts) return;
    syncUrl(query, cats, excludeCats, colors, excludeColors);
    setFilteredArtifacts(
      getFilteredArtifacts(
        query,
        cats,
        artifacts,
        locale,
        colors,
        excludeCats,
        excludeColors,
      ),
    );
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
          onResetFilters={handleResetFilters}
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
                excludeCats={excludeCats}
                onToggleCategory={handleToggleCategory}
                colors={colors}
                excludeColors={excludeColors}
                onToggleColor={handleToggleColor}
                onClearColors={handleClearColors}
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
