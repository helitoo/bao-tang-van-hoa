"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
}: {
  locale: Locale;
  dict: any;
  initQuery: string;
  initCats: string[];
}) {
  const router = useRouter();

  // Filters
  const [query, setQuery] = useState<string>(initQuery);
  const [cats, setCats] = useState<string[]>(initCats);

  // Hide / Show search panel
  const [showFilters, setShowFilters] = useState(true);

  // Set current filters to url

  function setUrl() {
    const search = new URLSearchParams();

    if (query.trim()) search.set("query", query.trim());
    cats.filter(Boolean).forEach((c) => search.append("cats", c));

    router.push(search.toString() ? `?${search.toString()}` : "");
  }

  // handle search submit

  const { artifacts } = useArtifact();

  const [filteredArtifacts, setFilteredArtifacts] = useState<
    Artifact[] | undefined
  >(artifacts);

  useEffect(() => {
    setFilteredArtifacts(artifacts);
  }, [artifacts]);

  function handleSearchSubmit() {
    if (!artifacts) return;
    setUrl();
    setFilteredArtifacts(getFilteredArtifacts(query, cats, artifacts, locale));
  }

  // First search
  useEffect(() => {
    if (!artifacts) return;
    setFilteredArtifacts(getFilteredArtifacts(query, cats, artifacts, locale));
  }, [artifacts]);

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

        {/* Body */}
        <div className={showFilters ? "block" : "hidden"}>
          <SearchBody
            locale={locale as Locale}
            dict={dict}
            query={query}
            setQuery={setQuery}
            cats={cats}
            setCats={setCats}
            handleSearchSubmit={handleSearchSubmit}
          />
        </div>
      </div>
      <SearchResult
        locale={locale}
        dict={dict}
        filteredArtifacts={filteredArtifacts}
      />
    </div>
  );
}
