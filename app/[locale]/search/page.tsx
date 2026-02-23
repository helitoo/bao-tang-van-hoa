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
  }>;
}) {
  // Get locale
  const { locale } = await params;
  const dict = await getLangDict(locale);

  //   Get query params
  const sp = await searchParams;

  const query = sp.query ?? "";

  const cats = Array.isArray(sp.cats) ? sp.cats : sp.cats ? [sp.cats] : [""];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 flex flex-col gap-8">
      <Search
        locale={locale as Locale}
        dict={dict}
        initQuery={query}
        initCats={cats}
      />
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 2px; } .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #44403c; }`}</style>
    </div>
  );
}
