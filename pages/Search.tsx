import React, { useState, useMemo, useEffect } from "react";
// Fix: Use namespace import for react-router-dom to resolve export issues
import * as ReactRouterDOM from "react-router-dom";
const { useSearchParams } = ReactRouterDOM;
import { Artifact } from "../types";
import { CATEGORY_GROUPS } from "../constants";
import { useLanguage } from "../App";
import ArtifactCard from "../components/ArtifactCard";
import simalarityScore from "../fuzzy-searching";

interface SearchProps {
  artifacts: Artifact[];
}

const ITEMS_PER_PAGE = 50;

const Search: React.FC<SearchProps> = ({ artifacts = [] }) => {
  const { t, locale } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);

  const query = searchParams.get("q") || "";
  const catIdsParam = searchParams.get("cats") || "";

  const [filterText, setFilterText] = useState(query);
  const [selectedCats, setSelectedCats] = useState<string[]>(
    catIdsParam ? catIdsParam.split(",").filter(Boolean) : [],
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setFilterText(query);
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    setSelectedCats(catIdsParam ? catIdsParam.split(",").filter(Boolean) : []);
    setCurrentPage(1);
  }, [catIdsParam]);

  const filteredResults = useMemo(() => {
    if (!artifacts || !Array.isArray(artifacts)) return [];

    let results = [...artifacts];

    // 1. Filter by hard category selections (from sidebar)
    if (selectedCats.length > 0) {
      const selectedByGroup: Record<string, string[]> = {};
      selectedCats.forEach((catId) => {
        for (const group of CATEGORY_GROUPS) {
          if (!group || !group.options) continue;
          if (group.options.find((o) => o && o.id === catId)) {
            if (!selectedByGroup[group.id]) selectedByGroup[group.id] = [];
            selectedByGroup[group.id].push(catId);
            break;
          }
        }
      });

      results = results.filter((artifact) => {
        if (
          !artifact ||
          !artifact.categories ||
          !Array.isArray(artifact.categories)
        )
          return false;
        return Object.values(selectedByGroup).every((groupSelections) => {
          return groupSelections.some((selectedId) =>
            artifact.categories.includes(selectedId),
          );
        });
      });
    }

    // 2. Filter and rank by text similarity
    const query = filterText.trim().toLowerCase();

    if (!query) return results;

    const categoryMap = new Map<string, string>();
    for (const group of CATEGORY_GROUPS) {
      for (const opt of group.options) {
        categoryMap.set(opt.id, opt.name[locale]);
      }
    }

    results = results
      .map((artifact) => {
        // Get categories' name
        const catNames = (artifact.categories || [])
          .map((id) => categoryMap.get(id) || "")
          .join(" ");

        // name + short_description
        const text1 = [artifact.name, artifact.short_description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const text2 = [
          catNames,
          artifact.description,
          artifact.location,
          artifact.author,
          artifact.contributor,
          artifact.artifact_date,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const searchScore =
          simalarityScore(query, text1) * 0.8 +
          simalarityScore(query, text2) * 0.2;

        return { ...artifact, searchScore };
      })
      .filter((a) => a.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore);

    return results;
  }, [artifacts, filterText, selectedCats, locale]);

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const updateURL = (text: string, cats: string[]) => {
    const params: Record<string, string> = {};
    if (text.trim()) params.q = text.trim();
    if (cats.length > 0) params.cats = cats.join(",");
    setSearchParams(params);
  };

  const handleSearchSubmit = () => {
    updateURL(filterText, selectedCats);
    setCurrentPage(1);
  };

  const toggleCategory = (id: string) => {
    const nextCats = selectedCats.includes(id)
      ? selectedCats.filter((c) => c !== id)
      : [...selectedCats, id];

    setSelectedCats(nextCats);
    setCurrentPage(1);
    updateURL(filterText, nextCats);
  };

  const clearAllFilters = () => {
    setFilterText("");
    setSelectedCats([]);
    setSearchParams({});
    setCurrentPage(1);
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 flex flex-col gap-8">
      <aside className="w-full flex-shrink-0">
        <div className="bg-white dark:bg-stone-900 p-6 border border-stone-200 dark:border-stone-800 transition-colors duration-300">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold dark:text-stone-100 uppercase">
              {t("filter_title")}
            </h3>
            <div className="flex gap-3 md:gap-5">
              {/* Clear filters button */}
              <button
                onClick={clearAllFilters}
                className="text-[10px] text-stone-400 hover:text-viet-red transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-eraser-icon lucide-eraser"
                >
                  <path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21" />
                  <path d="m5.082 11.09 8.828 8.828" />
                </svg>
              </button>

              {/* Hidden button */}
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="text-[10px] text-stone-400 hover:text-viet-red transition-colors"
              >
                {showFilters ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-eye-closed-icon lucide-eye-closed"
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
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-eye-icon lucide-eye"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Body */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
            className={`${showFilters ? "block" : "hidden"}`}
          >
            {/* Search Box */}
            <div className="mt-3 flex-1 w-full relative flex items-center">
              <input
                type="text"
                placeholder={t("nav_placeholder")}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                className="w-full bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-sm px-4 py-1.5 focus:outline-none focus:border-viet-red transition-colors text-sm shadow-sm font-medium"
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="absolute right-3 text-stone-400 hover:text-viet-red flex items-center"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-search-icon lucide-search"
                >
                  <path d="m21 21-4.34-4.34" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
              </button>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CATEGORY_GROUPS.map((group) => (
                <div key={group.id} className="mt-3">
                  <h4 className="text-[9px] md:text-[10px] font-extralight uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3 border-b border-stone-100 dark:border-stone-800 pb-2 flex items-center flex-shrink-0">
                    <span className="w-1 h-1 bg-viet-red mr-2"></span>
                    {group.title[locale]}
                  </h4>
                  <div className="grid grid-cols-1 gap-1 pr-2">
                    {group.options.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center space-x-2 cursor-pointer group py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCats.includes(opt.id)}
                          onChange={() => toggleCategory(opt.id)}
                          className="w-3.5 h-3.5 border border-stone-300 dark:border-stone-600 rounded-sm text-viet-red focus:ring-viet-red cursor-pointer bg-white dark:bg-stone-800 transition-all"
                        />
                        <span
                          className={`text-xs transition-colors font-medium ${selectedCats.includes(opt.id) ? "text-viet-red font-extrabold" : "text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-100"}`}
                        >
                          {opt.name[locale]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="mt-3 w-full bg-stone-900 dark:bg-stone-700 text-white py-3 hover:bg-viet-red dark:hover:bg-viet-red transition-all transform active:scale-95 font-extrabold uppercase tracking-widest text-[10px] shadow-md"
            >
              {t("filter_btn")}
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-2 border-stone-200 dark:border-stone-800 pb-4 gap-4">
          <span className="text-stone-500 font-medium italic text-sm">
            {t("found")} {filteredResults.length} {t("artifacts")}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 xl:grid-cols-6 gap-4">
          {paginatedResults.map((item) => (
            <ArtifactCard key={item.id} item={item} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="w-8 h-8 border font-extrabold text-[10px] bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-viet-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                  className={`w-8 h-8 border font-extrabold text-[10px] transition-colors ${
                    currentPage === pageNum
                      ? "bg-viet-red text-white border-viet-red"
                      : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-viet-red"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 border font-extrabold text-[10px] bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-viet-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Last Page"
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 2px; } .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #44403c; }`}</style>
    </div>
  );
};

export default Search;
