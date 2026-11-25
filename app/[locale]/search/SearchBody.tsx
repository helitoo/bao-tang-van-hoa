"use client";

import type { Locale } from "@/lib/lang";
import { CATEGORY_GROUPS } from "@/lib/consts/categories";
import CategorySelector, {
  type CategoryFilterMode,
} from "@/components/CategorySelector";
import ColorSelector, {
  type ColorFilterMode,
} from "@/components/ColorSelector";

const PRESET_COLORS: { hex: string; name: Record<string, string> }[] = [
  {
    hex: "#B91C1C",
    name: {
      vi: "Đỏ son",
      en: "Cinnabar Red",
      fr: "Rouge cinabre",
      ja: "朱色（赤）",
      ko: "주홍색 (빨강)",
      zh: "朱砂红",
    },
  },
  {
    hex: "#FF8211",
    name: {
      vi: "Hỏa hoàng",
      en: "Terracotta",
      fr: "Terre cuite",
      ja: "テラコッタ",
      ko: "테라코타",
      zh: "陶土橙",
    },
  },
  {
    hex: "#D4AF37",
    name: {
      vi: "Hoàng",
      en: "Gold",
      fr: "Or",
      ja: "黄金色",
      ko: "황금색",
      zh: "黄金",
    },
  },
  {
    hex: "#78350F",
    name: {
      vi: "Nâu gốm / Gỗ",
      en: "Ceramic / Wood Brown",
      fr: "Brun céramique / Bois",
      ja: "陶器・木褐色",
      ko: "도자기 / 목재 갈색",
      zh: "陶瓷褐 / 木色",
    },
  },
  {
    hex: "#15803D",
    name: {
      vi: "Cẩm thạch",
      en: "Jade Green",
      fr: "Vert jade",
      ja: "翡翠色",
      ko: "비취색",
      zh: "翡翠绿",
    },
  },
  {
    hex: "#0D9488",
    name: {
      vi: "Men ngọc",
      en: "Patina",
      fr: "Patine",
      ja: "緑青",
      ko: "동록",
      zh: "铜绿",
    },
  },
  {
    hex: "#1D4ED8",
    name: {
      vi: "Men lam",
      en: "Cobalt Blue",
      fr: "Bleu cobalt",
      ja: "染付青",
      ko: "청화 코발트 블루",
      zh: "青花钴蓝",
    },
  },
  {
    hex: "#6B21A8",
    name: {
      vi: "Sa tanh",
      en: "Imperial Purple",
      fr: "Pourpre impérial",
      ja: "雅紫",
      ko: "황실 자색",
      zh: "帝王紫",
    },
  },
  {
    hex: "#F5F5F0",
    name: {
      vi: "Men trắng",
      en: "Ivory White",
      fr: "Blanc ivoire",
      ja: "象牙色",
      ko: "상아백색",
      zh: "象牙白",
    },
  },
  {
    hex: "#1C1917",
    name: {
      vi: "Đen tuyền",
      en: "Lacquer Black",
      fr: "Noir laque",
      ja: "漆黒",
      ko: "칠흑색",
      zh: "漆黑",
    },
  },
];

export default function SearchBody({
  locale,
  dict,
  query,
  setQuery,
  cats,
  excludeCats,
  onToggleCategory,
  colors,
  excludeColors,
  onToggleColor,
  onClearColors,
  handleSearchSubmit,
}: {
  locale: Locale;
  dict: any;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  cats: string[];
  excludeCats: string[];
  onToggleCategory: (id: string) => void;
  colors: string[];
  excludeColors: string[];
  onToggleColor: (hex: string, forceMode?: ColorFilterMode) => void;
  onClearColors: () => void;
  handleSearchSubmit: () => void;
}) {
  // Tìm màu tùy chỉnh đang được kích hoạt (nếu không nằm trong PRESET_COLORS)
  const activeCustomColor =
    [...colors, ...excludeColors].find(
      (hex) =>
        !PRESET_COLORS.some((c) => c.hex.toLowerCase() === hex.toLowerCase()),
    ) || "";

  const hasActiveColors = colors.length > 0 || excludeColors.length > 0;

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
          className="w-full bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-sm px-4 py-1.5 focus:outline-none focus:border-viet-red transition-colors text-sm shadow-sm font-medium"
        />
        <button
          type="submit"
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

      {/* Color Filter */}
      <div className="mt-4 pt-3 pb-1 border-t border-stone-100 dark:border-stone-800">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[9px] md:text-[10px] font-extralight uppercase tracking-widest text-stone-400 dark:text-stone-500 flex items-center">
            <span className="w-1 h-1 bg-viet-red mr-2"></span>
            {dict.filter_color || "Lọc theo màu sắc chủ đạo"}
          </h4>
          {hasActiveColors && (
            <button
              type="button"
              onClick={onClearColors}
              className="text-[10px] text-stone-400 hover:text-viet-red transition-colors flex items-center gap-1 font-semibold"
            >
              <span>✕</span>
              <span>{dict.clear_color || "Bỏ chọn màu"}</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((c) => {
            const isIncluded = colors.some(
              (col) => col.toLowerCase() === c.hex.toLowerCase(),
            );
            const isExcluded = excludeColors.some(
              (col) => col.toLowerCase() === c.hex.toLowerCase(),
            );
            const mode: ColorFilterMode = isIncluded
              ? "include"
              : isExcluded
              ? "exclude"
              : "none";

            return (
              <ColorSelector
                key={c.hex}
                hex={c.hex}
                name={c.name[locale] || c.name.vi}
                mode={mode}
                onToggle={onToggleColor}
                locale={locale}
                dict={dict}
              />
            );
          })}

          {/* Custom Color Selector (nếu đã chọn) */}
          {activeCustomColor && (
            <ColorSelector
              hex={activeCustomColor}
              name={dict.custom_color || "Màu tùy chỉnh"}
              mode={
                colors.some(
                  (col) => col.toLowerCase() === activeCustomColor.toLowerCase(),
                )
                  ? "include"
                  : excludeColors.some(
                      (col) =>
                        col.toLowerCase() === activeCustomColor.toLowerCase(),
                    )
                  ? "exclude"
                  : "none"
              }
              onToggle={onToggleColor}
              locale={locale}
              dict={dict}
            />
          )}

          {/* Custom Color Picker Button */}
          <label
            title={dict.custom_color || "Chọn màu tùy chỉnh"}
            className="w-6.5 h-6.5 rounded-full border border-dashed border-stone-400 dark:border-stone-500 hover:border-viet-red cursor-pointer flex items-center justify-center relative transition-transform hover:scale-105"
          >
            <input
              type="color"
              value={activeCustomColor || "#b91c1c"}
              onChange={(e) => onToggleColor(e.target.value, "include")}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <span className="text-xs text-stone-500 dark:text-stone-400 font-bold leading-none select-none">
              +
            </span>
          </label>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {CATEGORY_GROUPS.map((group) => (
          <div key={group.id} className="mt-3">
            <h4 className="text-[9px] md:text-[10px] font-extralight uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3 border-b border-stone-100 dark:border-stone-800 pb-2 flex items-center flex-shrink-0">
              <span className="w-1 h-1 bg-viet-red mr-2"></span>
              {group.title[locale] || group.title.en || group.title.vi}
            </h4>
            <div className="grid grid-cols-1 gap-0.5 pr-2">
              {group.options.map((opt) => {
                const mode: CategoryFilterMode = cats.includes(opt.id)
                  ? "include"
                  : excludeCats.includes(opt.id)
                  ? "exclude"
                  : "none";

                return (
                  <CategorySelector
                    key={opt.id}
                    id={opt.id}
                    label={opt.name[locale] || opt.name.en || opt.name.vi}
                    mode={mode}
                    onToggle={onToggleCategory}
                    locale={locale}
                    dict={dict}
                  />
                );
              })}
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
