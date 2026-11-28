import { getLangDict, Locale } from "@/lib/lang";
import Search from "@/app/[locale]/search/Search";
import { searchArtifactsServer } from "@/lib/serverArtifacts";
import { parseCategoryParams } from "@/lib/consts/categories";

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
    page?: string | string[];
  }>;
}) {
  // Get locale
  const { locale } = await params;
  const dict = await getLangDict(locale);

  // Get query params
  const sp = await searchParams;

  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const parsedPage = rawPage ? parseInt(rawPage, 10) : 1;
  const page = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const query = sp.query ?? "";
  const rawCats = Array.isArray(sp.cats) ? sp.cats : sp.cats ? [sp.cats] : [];
  const rawExcludeCats = Array.isArray(sp.excludeCats)
    ? sp.excludeCats
    : sp.excludeCats
    ? [sp.excludeCats]
    : [];

  // Categories are numeric ids (?cats=14); legacy codes (?cats=kt) still work
  const includeCatParams: string[] = [];
  const excludeCatParams: string[] = [...rawExcludeCats.filter(Boolean)];

  rawCats.forEach((c) => {
    if (!c) return;
    if (c.startsWith("-")) {
      excludeCatParams.push(c.slice(1));
    } else {
      includeCatParams.push(c);
    }
  });

  const cats = parseCategoryParams(includeCatParams);
  const excludeCats = parseCategoryParams(excludeCatParams).filter(
    (id) => !cats.includes(id),
  );

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

  // Filter + rank + page on the server: the browser only receives one page.
  // The full list comes from the Supabase Data Cache, not a per-request query.
  const result = await searchArtifactsServer(
    { query, cats, excludeCats, colors, excludeColors },
    page,
    locale as Locale,
  );

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
        initPage={result.page}
        result={result}
      />
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 2px; } .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #44403c; }`}</style>
    </div>
  );
}
