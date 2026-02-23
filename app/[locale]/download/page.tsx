import Link from "next/link";

import { getLangDict, Locale } from "@/lib/lang";
import Download from "@/app/[locale]/download/Download";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getLangDict(locale);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 min-h-[calc(100vh-5rem)]">
      <div className="flex flex-col items-center mb-16 text-center">
        <nav className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-4">
          <Link
            href={`/${locale}/`}
            hrefLang={locale}
            className="hover:text-viet-red transition-colors"
          >
            {dict.nav_home}
          </Link>
          <span>/</span>
          <span className="text-viet-red">{dict.nav_download}</span>
        </nav>
        <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-tight mb-4">
          {dict.nav_download}
        </h1>
        <div className="h-1 w-24 bg-viet-red shadow-lg mb-6"></div>
        <div className="relative">
          <p className="text-justify">{dict.download_desc}</p>
          <Download locale={locale as Locale} />
        </div>
      </div>
    </div>
  );
}
