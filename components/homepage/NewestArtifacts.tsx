"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import { useArtifact } from "@/contexts/artifact";
import ArtifactCard from "@/components/ArtifactCard";
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function NewestArtifacts({
  locale,
  dict,
}: {
  locale: Locale;
  dict: any;
}) {
  const { artifacts } = useArtifact();

  return (
    <section className="max-w-7xl mx-auto px-4">
      <motion.div
        className="flex items-center justify-between mb-8 border-b-2 border-stone-200 dark:border-stone-800 pb-4"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-tight">
          {dict.featured_title}
        </h3>
        <Link
          href={`/${locale}/search`}
          hrefLang={locale}
          className="text-xs font-extrabold uppercase tracking-widest text-viet-red hover:underline transition-all"
        >
          {dict.see_all}
        </Link>
      </motion.div>

      {artifacts && artifacts.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {artifacts.slice(0, 12).map((item) => (
            <motion.div key={item.id} variants={itemVariants} className="h-full">
              <ArtifactCard item={item} locale={locale} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-12 flex justify-center text-stone-400">
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
            className="lucide lucide-ellipsis animate-pulse"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </div>
      )}
    </section>
  );
}
