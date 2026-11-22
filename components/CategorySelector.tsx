"use client";

import React from "react";
import type { Locale } from "@/lib/lang";

export type CategoryFilterMode = "none" | "include" | "exclude";

export const CATEGORY_STATE_LABELS: Record<
  Locale,
  Record<CategoryFilterMode, string>
> = {
  vi: {
    none: "Không chọn",
    include: "Bao gồm",
    exclude: "Loại trừ",
  },
  en: {
    none: "Unselected",
    include: "Include",
    exclude: "Exclude",
  },
  fr: {
    none: "Non sélectionné",
    include: "Inclure",
    exclude: "Exclure",
  },
  zh: {
    none: "未选择",
    include: "包含",
    exclude: "排除",
  },
  ja: {
    none: "未選択",
    include: "含む",
    exclude: "除外",
  },
  ko: {
    none: "선택 안 함",
    include: "포함",
    exclude: "제외",
  },
};

export interface CategorySelectorProps {
  id: string;
  label: string;
  mode: CategoryFilterMode;
  onToggle: (id: string) => void;
  locale?: Locale;
  dict?: any;
  className?: string;
}

export default function CategorySelector({
  id,
  label,
  mode = "none",
  onToggle,
  locale = "vi",
  dict,
  className = "",
}: CategorySelectorProps) {
  // Lấy nhãn trạng thái theo đa ngôn ngữ
  const activeLocale = (locale in CATEGORY_STATE_LABELS ? locale : "vi") as Locale;
  const stateLabel =
    mode === "include"
      ? dict?.filter_state_include || CATEGORY_STATE_LABELS[activeLocale].include
      : mode === "exclude"
      ? dict?.filter_state_exclude || CATEGORY_STATE_LABELS[activeLocale].exclude
      : dict?.filter_state_none || CATEGORY_STATE_LABELS[activeLocale].none;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      title={`${label}: ${stateLabel}`}
      aria-label={`${label} (${stateLabel})`}
      className={`group relative flex items-center space-x-2 py-1 px-1 -mx-1 rounded cursor-pointer select-none transition-colors hover:bg-stone-100/70 dark:hover:bg-stone-800/50 ${className}`}
    >
      {/* Selector Box */}
      <div
        className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center transition-all duration-150 shrink-0 ${
          mode === "include"
            ? "bg-viet-red border border-viet-red text-white shadow-xs scale-105"
            : mode === "exclude"
            ? "bg-viet-red border border-viet-red text-white shadow-xs scale-105"
            : "bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 group-hover:border-stone-400 dark:group-hover:border-stone-500"
        }`}
      >
        {mode === "include" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-in fade-in zoom-in-75 duration-150"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )}

        {mode === "exclude" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-in fade-in zoom-in-75 duration-150"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )}
      </div>

      {/* Category Label */}
      <span
        title={stateLabel}
        className={`text-xs transition-colors flex-1 ${
          mode === "include"
            ? "text-viet-red font-extrabold"
            : mode === "exclude"
            ? "text-viet-red font-extrabold line-through decoration-viet-red/60"
            : "text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-100 font-medium"
        }`}
      >
        {label}
      </span>

      {/* State Badge on hover / active */}
      {mode !== "none" && (
        <span
          className={`text-[9px] uppercase tracking-wider font-bold px-1 py-0.2 rounded-xs shrink-0 select-none ${
            mode === "include"
              ? "text-viet-red bg-red-100/70 dark:bg-red-950/40"
              : "text-viet-red bg-red-100/70 dark:bg-red-950/40"
          }`}
        >
          {stateLabel}
        </span>
      )}
    </div>
  );
}
