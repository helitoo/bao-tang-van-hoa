"use client";

import React from "react";
import type { Locale } from "@/lib/lang";
import { CATEGORY_STATE_LABELS } from "@/components/CategorySelector";

export type ColorFilterMode = "none" | "include" | "exclude";

export interface ColorSelectorProps {
  hex: string;
  name: string;
  mode: ColorFilterMode;
  onToggle: (hex: string) => void;
  locale?: Locale;
  dict?: any;
  className?: string;
}

export default function ColorSelector({
  hex,
  name,
  mode = "none",
  onToggle,
  locale = "vi",
  dict,
  className = "",
}: ColorSelectorProps) {
  const activeLocale = (locale in CATEGORY_STATE_LABELS ? locale : "vi") as Locale;
  const stateLabel =
    mode === "include"
      ? dict?.filter_state_include || CATEGORY_STATE_LABELS[activeLocale].include
      : mode === "exclude"
      ? dict?.filter_state_exclude || CATEGORY_STATE_LABELS[activeLocale].exclude
      : dict?.filter_state_none || CATEGORY_STATE_LABELS[activeLocale].none;

  const tooltipText = `${name} (${stateLabel})`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle(hex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(hex);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      title={tooltipText}
      aria-label={tooltipText}
      className={`group relative w-6.5 h-6.5 rounded-full border transition-all flex items-center justify-center cursor-pointer select-none ${
        mode !== "none"
          ? "scale-110 border-viet-red ring-2 ring-viet-red/60 shadow-md"
          : "border-stone-300 dark:border-stone-600 hover:scale-105"
      } ${className}`}
      style={{ backgroundColor: hex }}
    >
      {/* Icon Badge when Include */}
      {mode === "include" && (
        <span
          title={tooltipText}
          className="w-4 h-4 rounded-full bg-viet-red text-white flex items-center justify-center shadow-xs animate-in fade-in zoom-in-75 duration-150"
        >
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
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      )}

      {/* Icon Badge when Exclude */}
      {mode === "exclude" && (
        <span
          title={tooltipText}
          className="w-4 h-4 rounded-full bg-viet-red text-white flex items-center justify-center shadow-xs animate-in fade-in zoom-in-75 duration-150"
        >
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
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      )}
    </button>
  );
}
