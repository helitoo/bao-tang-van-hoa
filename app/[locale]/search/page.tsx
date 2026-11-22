import { getLangDict, Locale } from "@/lib/lang";
import Search from "@/app/[locale]/search/Search";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    query?: string;
    cats?: string | string[];
    excludeCats?: string | string[];
    color?: string | string[];
    colors?: string | string[];
    excludeColors?: string | string[];
  }>;
}) {
  // Get locale
  const { locale } = await params;
  const dict = await getLangDict(locale);

  // Get query params
  const sp = await searchParams;

  const query = sp.query ?? "";
  const rawCats = Array.isArray(sp.cats) ? sp.cats : sp.cats ? [sp.cats] : [];
  const rawExcludeCats = Array.isArray(sp.excludeCats)
    ? sp.excludeCats
    : sp.excludeCats
    ? [sp.excludeCats]
    : [];

  const cats: string[] = [];
  const excludeCats: string[] = [...rawExcludeCats.filter(Boolean)];

  rawCats.forEach((c) => {
    if (!c) return;
    if (c.startsWith("-")) {
      excludeCats.push(c.slice(1));
    } else {
      cats.push(c);
    }
  });

  const rawColors = [
    ...(Array.isArray(sp.colors) ? sp.colors : sp.colors ? [sp.colors] : []),
    ...(Array.isArray(sp.color) ? sp.color : sp.color ? [sp.color] : []),
  ];
  const rawExcludeColors = Array.isArray(sp.excludeColors)
    ? sp.excludeColors
    : sp.excludeColors
    ? [sp.excludeColors]
    : [];

  const colors: string[] = [];
  const excludeColors: string[] = [...rawExcludeColors.filter(Boolean)];

  rawColors.forEach((col) => {
    if (!col) return;
    if (col.startsWith("-")) {
      excludeColors.push(col.slice(1));
    } else {
      colors.push(col);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 flex flex-col gap-8">
      <Search
        locale={locale as Locale}
        dict={dict}
        initQuery={query}
        initCats={cats}
        initExcludeCats={excludeCats}
        initColors={colors}
        initExcludeColors={excludeColors}
      />
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 2px; } .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #44403c; }`}</style>
    </div>
  );
}
