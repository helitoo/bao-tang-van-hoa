import Link from "next/link";
import { type Locale, getLangDict } from "@/lib/lang";
import Artifact from "@/app/[locale]/artifact/[aid]/Artifact";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; aid: string }>;
}) {
  const { locale, aid } = await params;
  const dict = await getLangDict(locale);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-waidest text-stone-500 mb-6">
          <Link
            href={`/${locale}/`}
            hrefLang={locale}
            className="hover:text-viet-red transition-colors"
          >
            {dict.nav_home}
          </Link>
          <span>/</span>
          <Link
            href={`/${locale}/search`}
            className="hover:text-viet-red transition-colors"
          >
            {dict.nav_search}
          </Link>
        </nav>
        <Artifact locale={locale as Locale} dict={dict} aid={aid} />
      </div>
    </div>
  );
}
