"use client";

import type { Locale } from "@/lib/lang";
import { CATEGORY_GROUPS } from "@/lib/consts/categories";

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
  setCats,
  selectedColor,
  onColorChange,
  handleSearchSubmit,
}: {
  locale: Locale;
  dict: any;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  cats: string[];
  setCats: React.Dispatch<React.SetStateAction<string[]>>;
  selectedColor: string;
  onColorChange: (color: string) => void;
  handleSearchSubmit: () => void;
}) {
  // Toggle category
  function toggleCat(id: string) {
    const newCats = cats.includes(id)
      ? cats.filter((c) => c !== id)
      : [...cats, id];

    setCats(newCats);
  }

  const isCustomColor =
    Boolean(selectedColor) &&
    !PRESET_COLORS.some(
      (c) => c.hex.toLowerCase() === selectedColor.toLowerCase(),
    );

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

      {/* Color Filter */}
      <div className="mt-4 pt-3 pb-1 border-t border-stone-100 dark:border-stone-800">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[9px] md:text-[10px] font-extralight uppercase tracking-widest text-stone-400 dark:text-stone-500 flex items-center">
            <span className="w-1 h-1 bg-viet-red mr-2"></span>
            {dict.filter_color || "Lọc theo màu sắc chủ đạo"}
          </h4>
          {selectedColor && (
            <button
              type="button"
              onClick={() => onColorChange("")}
              className="text-[10px] text-stone-400 hover:text-viet-red transition-colors flex items-center gap-1 font-semibold"
            >
              <span>✕</span>
              <span>{dict.clear_color || "Bỏ chọn màu"}</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((c) => {
            const isSelected =
              selectedColor.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.hex}
                type="button"
                title={c.name[locale] || c.name.vi}
                onClick={() => onColorChange(isSelected ? "" : c.hex)}
                className={`w-6 h-6 rounded-full border transition-all relative flex items-center justify-center ${
                  isSelected
                    ? "scale-110 border-viet-red ring-2 ring-viet-red/50 shadow"
                    : "border-stone-300 dark:border-stone-600 hover:scale-105"
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {isSelected && (
                  <span className="text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    ✓
                  </span>
                )}
              </button>
            );
          })}

          {/* Custom Color Picker Button */}
          <label
            title={dict.custom_color || "Chọn màu tùy chỉnh"}
            className={`w-6 h-6 rounded-full border cursor-pointer flex items-center justify-center relative transition-transform hover:scale-105 ${
              isCustomColor
                ? "scale-110 border-viet-red ring-2 ring-viet-red/50 shadow"
                : "border-dashed border-stone-400 dark:border-stone-500 hover:border-viet-red"
            }`}
            style={{
              backgroundColor: isCustomColor ? selectedColor : undefined,
            }}
          >
            <input
              type="color"
              value={selectedColor || "#b91c1c"}
              onChange={(e) => onColorChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {isCustomColor ? (
              <span className="text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                ✓
              </span>
            ) : (
              <span className="text-xs text-stone-500 dark:text-stone-400 font-bold leading-none select-none">
                +
              </span>
            )}
          </label>

          {/* Active color label */}
          {selectedColor && (
            <span className="text-[11px] font-mono font-medium text-stone-500 dark:text-stone-400 ml-1">
              {selectedColor.toUpperCase()}
            </span>
          )}
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
                    {opt.name[locale] || opt.name.en || opt.name.vi}
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
