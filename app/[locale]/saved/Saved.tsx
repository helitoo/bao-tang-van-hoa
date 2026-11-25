"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import ArtifactCard from "@/components/ArtifactCard";
import { useArtifact } from "@/contexts/artifact";
import { Locale } from "@/lib/lang";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

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
    <div className="space-y-8">
      {/* Saved Artifacts Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-viet-red"></span>
          <h3 className="text-base md:text-lg font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tight">
            {dict.saved_title}
          </h3>
          <span className="text-stone-500 font-medium italic text-xs">
            ({savedArtifacts.length} {dict.artifacts})
          </span>
        </div>

        {savedArtifacts.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {savedArtifacts.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="h-full"
              >
                <ArtifactCard item={item} locale={locale} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="py-24 text-center space-y-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <svg
              className="w-16 h-16 mx-auto text-stone-300 dark:text-stone-700"
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href={`/${locale}/search`}
                className="btn inline-block bg-viet-red text-white px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
              >
                {dict.hero_btn}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
