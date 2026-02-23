"use client";

import { useState } from "react";
import type { Locale } from "@/lib/lang";
import { CATEGORY_GROUPS } from "@/lib/consts/categories";

export default function SearchBody({
  locale,
  dict,
  query,
  setQuery,
  cats,
  setCats,
  handleSearchSubmit,
}: {
  locale: Locale;
  dict: any;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  cats: string[];
  setCats: React.Dispatch<React.SetStateAction<string[]>>;
  handleSearchSubmit: () => void;
}) {
  // Toggle category
  function toggleCat(id: string) {
    const newCats = cats.includes(id)
      ? cats.filter((c) => c !== id)
      : [...cats, id];

    setCats(newCats);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearchSubmit();
      }}
    >
      {/* Search Box */}
      <div className="mt-3 flex-1 w-full relative flex items-center">
        <input
          type="text"
          placeholder={dict.nav_placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
          className="w-full bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-sm px-4 py-1.5 focus:outline-none focus:border-viet-red transition-colors text-sm shadow-sm font-medium"
        />
        <button
          type="button"
          onClick={handleSearchSubmit}
          className="btn absolute right-3 text-stone-400 hover:text-viet-red flex items-center"
          aria-label="Search"
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
            className="lucide lucide-search-icon lucide-search"
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
                    checked={cats.includes(opt.id)}
                    onChange={() => toggleCat(opt.id)}
                    className="w-3.5 h-3.5 border border-stone-300 dark:border-stone-600 rounded-sm text-viet-red focus:ring-viet-red cursor-pointer bg-white dark:bg-stone-800 transition-all"
                  />
                  <span
                    className={`text-xs transition-colors font-medium ${cats.includes(opt.id) ? "text-viet-red font-extrabold" : "text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-100"}`}
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
        className="btn mt-3 w-full bg-stone-900 dark:bg-stone-700 text-white py-3 hover:bg-viet-red dark:hover:bg-viet-red transition-all transform font-extrabold uppercase tracking-widest text-[10px]"
      >
        {dict.filter_btn}
      </button>
    </form>
  );
}
