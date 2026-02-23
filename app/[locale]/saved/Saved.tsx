"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

import ArtifactCard from "@/components/ArtifactCard";
import { useArtifact } from "@/contexts/artifact";
import { Locale } from "@/lib/lang";

export default function Saved({ locale, dict }: { locale: Locale; dict: any }) {
  const { artifacts } = useArtifact();

  // Load saved artifacts
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("saved_artifacts");
    if (saved) {
      try {
        setSavedIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved artifacts", e);
      }
    }
  }, []);

  // Get saved artifacts info
  const savedArtifacts = useMemo(() => {
    if (!artifacts) return;
    return artifacts.filter((a) => savedIds.includes(a.id));
  }, [artifacts, savedIds]);

  if (!savedArtifacts)
    return <div className="skeleton h-20 w-full rounded"></div>;

  return (
    <>
      <span className="text-stone-500 font-medium italic text-sm">
        {savedArtifacts.length} {dict.artifacts}
      </span>
      {savedArtifacts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {savedArtifacts.map((item) => (
            <ArtifactCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center space-y-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm">
          <svg
            className="w-16 h-16 mx-auto text-stone-200 dark:text-stone-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <p className="text-stone-400 dark:text-stone-500 italic text-lg">
            {dict.saved_empty}
          </p>
          <Link
            href={`/${locale}/search`}
            className="btn inline-block bg-viet-red text-white px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all"
          >
            {dict.hero_btn}
          </Link>
        </div>
      )}
    </>
  );
}
