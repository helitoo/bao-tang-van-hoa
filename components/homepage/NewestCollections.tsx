"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import type { CollectionSummary } from "@/contexts/artifact";
import CollectionCard from "@/components/CollectionCard";
import type { Locale } from "@/lib/lang";

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

export default function NewestCollections({
  locale,
  dict,
  collections: newestCollections,
}: {
  locale: Locale;
  dict: any;
  /** Newest collections, already sorted and sliced on the server */
  collections: CollectionSummary[];
}) {

  if (!newestCollections || newestCollections.length === 0) {
    return null;
  }

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
          {dict.newest_collections_title || "Bộ sưu tập mới"}
        </h3>
        <Link
          href={`/${locale}/collection`}
          hrefLang={locale}
          className="text-xs font-extrabold uppercase tracking-widest text-viet-red hover:underline transition-all"
        >
          {dict.see_all}
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {newestCollections.map((col) => (
          <motion.div key={col.id} variants={itemVariants} className="h-full">
            <CollectionCard item={col} locale={locale} dict={dict} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
