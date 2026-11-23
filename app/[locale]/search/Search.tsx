"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  initPage = 1,
  initialArtifacts,
  initialFilteredArtifacts,
}: {
  locale: Locale;
  dict: any;
  initQuery: string;
  initCats: string[];
  initExcludeCats?: string[];
  initColors?: string[];
  initExcludeColors?: string[];
  initColor?: string;
  initPage?: number;
  initialArtifacts?: Artifact[];
  initialFilteredArtifacts?: Artifact[];
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
  const [currentPage, setCurrentPage] = useState<number>(initPage);

  useEffect(() => {
    setCurrentPage(initPage);
  }, [initPage]);

  // Hide / Show search panel
  const [showFilters, setShowFilters] = useState(true);

  const { artifacts: clientArtifacts } = useArtifact();
  const artifacts = initialArtifacts && initialArtifacts.length > 0 ? initialArtifacts : clientArtifacts;

  const [filteredArtifacts, setFilteredArtifacts] = useState<
    Artifact[] | undefined
  >(initialFilteredArtifacts || artifacts);

  // Helper để đồng bộ URL tìm kiếm
  const syncUrl = useCallback(
    (
      q: string,
      c: string[],
      exc: string[],
      cols: string[],
      excCols: string[],
      p: number = 1,
    ) => {
      const search = new URLSearchParams();
      if (q.trim()) search.set("query", q.trim());
      c.filter(Boolean).forEach((cat) => search.append("cats", cat));
      exc.filter(Boolean).forEach((cat) => search.append("excludeCats", cat));
      cols.filter(Boolean).forEach((col) => search.append("colors", col));
      excCols.filter(Boolean).forEach((col) => search.append("excludeColors", col));
      if (p > 1) {
        search.set("page", p.toString());
      }

      const urlStr = search.toString() ? `?${search.toString()}` : `/${locale}/search`;
      router.replace(urlStr, { scroll: false });
    },
    [locale, router],
  );

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
    prevFilterKey.current = "||||";
    setCurrentPage(1);
    syncUrl("", [], [], [], [], 1);
  }

  // Cờ nhận diện lần render đầu tiên
  const isFirstRender = useRef(true);
  const prevFilterKey = useRef(
    `${initQuery}|${initCats.join(",")}|${(initExcludeCats || []).join(",")}|${parsedInitColors.join(",")}|${(initExcludeColors || []).join(",")}`,
  );

  // Tự động lọc danh sách với debounce nhẹ (250ms) CHỈ khi các tiêu chí lọc thực sự thay đổi
  useEffect(() => {
    if (!artifacts) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!initialFilteredArtifacts) {
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
      return;
    }

    const currentFilterKey = `${query}|${cats.join(",")}|${excludeCats.join(",")}|${colors.join(",")}|${excludeColors.join(",")}`;
    // Nếu chỉ có page hoặc re-render mà tiêu chí filter không đổi thì không reset page về 1
    if (prevFilterKey.current === currentFilterKey) {
      return;
    }
    prevFilterKey.current = currentFilterKey;

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
      setCurrentPage(1);
      syncUrl(query, cats, excludeCats, colors, excludeColors, 1);
    }, 250);

    return () => clearTimeout(timer);
  }, [
    query,
    cats,
    excludeCats,
    colors,
    excludeColors,
    artifacts,
    locale,
    initialFilteredArtifacts,
    syncUrl,
  ]);

  // Xử lý khi nhấn nút "Tìm kiếm ngay" hoặc nhấn Enter
  function handleSearchSubmit() {
    if (!artifacts) return;
    prevFilterKey.current = `${query}|${cats.join(",")}|${excludeCats.join(",")}|${colors.join(",")}|${excludeColors.join(",")}`;
    setCurrentPage(1);
    syncUrl(query, cats, excludeCats, colors, excludeColors, 1);
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

  // Xử lý khi thay đổi trang từ danh sách kết quả
  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      syncUrl(query, cats, excludeCats, colors, excludeColors, newPage);
    },
    [query, cats, excludeCats, colors, excludeColors, syncUrl],
  );

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
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
