import React, { useState, useMemo, useEffect } from "react";
// Fix: Use namespace import for react-router-dom to resolve export issues
import * as ReactRouterDOM from "react-router-dom";
const { useSearchParams } = ReactRouterDOM;
import { Artifact } from "../types";
import { CATEGORY_GROUPS } from "../constants";
import { useLanguage } from "../App";
import ArtifactCard from "../components/ArtifactCard";

interface SearchProps {
  artifacts: Artifact[];
}

const ITEMS_PER_PAGE = 18;

const Search: React.FC<SearchProps> = ({ artifacts = [] }) => {
  const { t, locale } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const query = searchParams.get("q") || "";
  const catIdsParam = searchParams.get("cats") || "";

  const [filterText, setFilterText] = useState(query);
  const [selectedCats, setSelectedCats] = useState<string[]>(
    catIdsParam ? catIdsParam.split(",").filter(Boolean) : [],
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query, catIdsParam]);

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
    const lowerQuery = filterText.toLowerCase().trim();
    if (lowerQuery) {
      results = results
        .filter((artifact) => {
          // Helper to get category names for search
          const catNames = (artifact.categories || [])
            .map((catId) => {
              for (const group of CATEGORY_GROUPS) {
                const found = group.options.find((opt) => opt.id === catId);
                if (found) return found.name[locale];
              }
              return "";
            })
            .join(" ");

          const searchContent = [
            artifact.name,
            artifact.short_description,
            artifact.description,
            catNames,
            artifact.author,
            artifact.contributor,
            artifact.artifact_date,
            artifact.location,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchContent.includes(lowerQuery);
        })
        .map((artifact) => {
          let score = 0;
          const q = lowerQuery;

          const name = (artifact.name || "").toLowerCase();
          const shortDesc = (artifact.short_description || "").toLowerCase();
          const desc = (artifact.description || "").toLowerCase();
          const author = (artifact.author || "").toLowerCase();
          const contributor = (artifact.contributor || "").toLowerCase();
          const date = (artifact.artifact_date || "").toLowerCase();
          const location = (artifact.location || "").toLowerCase();

          // Get category names for scoring
          const catNames = (artifact.categories || [])
            .map((catId) => {
              for (const group of CATEGORY_GROUPS) {
                const found = group.options.find((opt) => opt.id === catId);
                if (found) return found.name[locale];
              }
              return "";
            })
            .join(" ")
            .toLowerCase();

          // Apply weighted scoring
          if (name.includes(q)) score += 20;
          if (shortDesc.includes(q)) score += 10;
          if (catNames.includes(q)) score += 8;
          if (desc.includes(q)) score += 5;
          if (author.includes(q)) score += 5;
          if (date.includes(q)) score += 5;
          if (location.includes(q)) score += 5;
          if (contributor.includes(q)) score += 3;

          return { ...artifact, searchScore: score };
        })
        .sort((a: any, b: any) => b.searchScore - a.searchScore);
    } else {
      results = [...results].sort((a, b) =>
        (b.id || "").localeCompare(a.id || ""),
      );
    }

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(filterText, selectedCats);
    setCurrentPage(1);
    setShowMobileFilters(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    setShowMobileFilters(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8">
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="lg:hidden flex items-center justify-center space-x-2 bg-stone-900 dark:bg-stone-800 text-white py-3 px-4 rounded-sm font-extrabold uppercase tracking-widest text-[10px] shadow-md transition-all active:scale-95"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span>{showMobileFilters ? t("filter_clear") : t("filter_title")}</span>
      </button>

      <aside
        className={`w-full lg:w-72 flex-shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}
      >
        <div className="bg-white dark:bg-stone-900 p-6 border border-stone-200 dark:border-stone-800 shadow-sm lg:sticky lg:top-24 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6 border-b-2 border-viet-red pb-2">
            <h3 className="text-xl font-extrabold dark:text-stone-100 uppercase">
              {t("filter_title")}
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 hover:text-viet-red transition-colors"
            >
              {t("filter_clear")}
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-extrabold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
                {t("filter_keyword")}
              </label>
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="..."
                className="w-full border-2 border-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 rounded-sm px-4 py-2 focus:border-viet-red focus:ring-0 outline-none transition-colors shadow-inner text-sm font-medium"
              />
            </div>

            <div className="space-y-6">
              <label className="block text-sm font-extrabold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                {t("filter_cats")}
              </label>
              {CATEGORY_GROUPS.map((group) => (
                <div key={group.id} className="space-y-2">
                  <h4 className="text-[10px] font-extralight text-stone-400 dark:text-stone-500 uppercase tracking-widest border-b border-stone-100 dark:border-stone-800 pb-1">
                    {group.title[locale]}
                  </h4>
                  <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
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
              className="w-full bg-stone-900 dark:bg-stone-700 text-white py-3 hover:bg-viet-red dark:hover:bg-viet-red transition-all transform active:scale-95 font-extrabold uppercase tracking-widest text-[10px] shadow-md"
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

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedResults.length > 0 ? (
            paginatedResults.map((item) => (
              <ArtifactCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-stone-400 italic text-sm font-medium">
              Không tìm thấy hiện vật nào phù hợp với bộ lọc.
            </div>
          )}
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
