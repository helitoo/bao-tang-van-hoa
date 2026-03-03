import Link from "next/link";

import { getLangDict, Locale } from "@/lib/lang";

import Statistics from "@/components/homepage/Statistics";
import NewestArtifacts from "@/components/homepage/NewestArtifacts";
import Logo from "@/components/Logo";
import BadgeSection from "@/components/homepage/BadgeSection";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getLangDict(locale);

  return (
    <div className="space-y-16">
      <section className="relative h-[500px] overflow-hidden bg-stone-900 flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="background.webp"
            alt="Khuê văn các"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-linear-to-b from-stone-900/70 via-stone-900/40 to-stone-900/80"></div>
        </div>
        <div className="relative z-10 text-center w-full">
          <h2 className="text-white text-2xl md:text-5xl font-extrabold mb-6 drop-shadow-2xl leading-tight">
            {dict.hero_title} <br />{" "}
            <span className="text-white drop-shadow-lg font-medium">
              {dict.hero_subtitle}
            </span>
          </h2>
          <div className="flex justify-center mb-10">
            <div className="h-1 w-24 bg-viet-red shadow-lg"></div>
          </div>
          <Link
            href={`/${locale}/search`}
            className="btn bg-viet-red text-white p-3 rounded-sm transition-all transform inline-block text-sm font-extrabold uppercase tracking-widest"
          >
            {dict.hero_btn}
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 text-center relative">
        <div className="mb-12 flex flex-col items-center">
          <h1 className="text-stone-900 dark:text-stone-100 text-4xl md:text-5xl font-extrabold mb-2 tracking-tight uppercase">
            {dict.museum_name}
          </h1>
          <span className="text-stone-400 dark:text-stone-500 text-xs font-extralight tracking-[0.5em] uppercase opacity-70">
            {dict.museum_sub}
          </span>
        </div>

        <div className="relative p-10 rounded-sm dark:bg-stone-900 mb-16 overflow-hidden transition-colors duration-300">
          <div className="halftone-bg absolute inset-0 pointer-events-none"></div>
          <div className="relative z-10">
            <Logo className="size-10 text-viet-red mb-6 mx-auto" />
            <p className="text-2xl md:text-3xl font-extrabold text-stone-800 dark:text-stone-200 mb-4 leading-relaxed px-4">
              {dict.mission_title}
            </p>
            <p className="text-viet-red font-extrabold uppercase text-xs tracking-widest opacity-90">
              {dict.mission_author}
            </p>
            <div className="mt-10 text-stone-600 dark:text-stone-400 leading-relaxed text-lg max-w-2xl mx-auto font-medium">
              {dict.mission_desc}
            </div>
          </div>
        </div>
      </section>

      {/* Rigid Dashboard: Adapted for Mobile & Desktop */}
      <Statistics locale={locale as Locale} dict={dict} />

      <BadgeSection locale={locale as Locale} dict={dict} />

      {/* Newest artifacts */}
      <NewestArtifacts locale={locale as Locale} dict={dict} />
    </div>
  );
}
