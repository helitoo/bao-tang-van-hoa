import Link from "next/link";

import { getLangDict } from "@/lib/lang";
import BadgePage from "@/app/[locale]/badge/BadgePage";

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
          <span className="text-viet-red">{dict.nav_badge}</span>
        </nav>
        <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-tight mb-4">
          {dict.nav_badge}
        </h1>
        <div className="h-1 w-24 bg-viet-red shadow-lg mb-6"></div>
        <div className="relative">
          <img
            src="/badge/badge-bg.png"
            alt="Badge Background"
            className="mx-auto w-full md:w-2/3 h-auto"
            draggable={false}
          />
          <p className="text-justify">{dict.badge_desc}</p>
          <BadgePage dict={dict} />
        </div>
      </div>
    </div>
  );
}
