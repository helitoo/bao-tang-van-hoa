import Link from "next/link";

import { getLangDict, Locale } from "@/lib/lang";

import Saved from "@/app/[locale]/saved/Saved";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getLangDict(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-2 border-stone-200 dark:border-stone-800 pb-4 gap-4">
        <div>
          <nav className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400 font-bold uppercase mb-2">
            <Link
              href={`/${locale}/`}
              hrefLang={locale}
              className="hover:text-viet-red transition-colors"
            >
              {dict.nav_home}
            </Link>
            <span>/</span>
            <span className="text-viet-red">{dict.nav_saved}</span>
          </nav>
          <h2 className="text-4xl font-serif-display dark:text-stone-100 italic">
            {dict.saved_title}
          </h2>
        </div>
      </div>
      <Saved locale={locale as Locale} dict={dict} />
    </div>
  );
}
