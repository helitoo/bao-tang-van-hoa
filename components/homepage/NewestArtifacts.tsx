"use client";

import Link from "next/link";

import { useArtifact } from "@/contexts/artifact";

import ArtifactCard from "@/components/ArtifactCard";
import { Locale } from "@/lib/lang";

export default function NewestArtifacts({
  locale,
  dict,
}: {
  locale: Locale;
  dict: any;
}) {
  const { artifacts } = useArtifact();

  return (
    <section className="max-w-7xl mx-auto px-4 pb-24">
      <div className="flex items-center justify-between mb-8 border-b-2 border-stone-200 dark:border-stone-800 pb-4">
        <h3 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 uppercase">
          {dict.featured_title}
        </h3>
        <Link
          href={`/${locale}/search`}
          hrefLang={locale}
          className="text-xs font-extrabold uppercase tracking-widest text-viet-red hover:underline transition-all"
        >
          {dict.see_all}
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {artifacts && artifacts.length > 0 ? (
          artifacts
            .slice(0, 12)
            .map((item) => (
              <ArtifactCard key={item.id} item={item} locale={locale} />
            ))
        ) : (
          <div className="col-span-full py-12 text-center text-stone-400 font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-ellipsis-icon lucide-ellipsis"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
