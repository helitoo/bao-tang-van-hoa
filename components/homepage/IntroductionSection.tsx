"use client";

import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function IntroductionSection({ dict }: { dict: any }) {
  return (
    <section className="max-w-5xl mx-auto px-4 text-center relative">
      <motion.div
        className="mb-12 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-stone-900 dark:text-stone-100 text-4xl md:text-5xl font-extrabold mb-2 tracking-tight uppercase">
          {dict.museum_name}
        </h1>
        <span className="text-stone-400 dark:text-stone-500 text-xs font-extralight tracking-[0.5em] uppercase opacity-70">
          {dict.museum_sub}
        </span>
      </motion.div>

      <motion.div
        className="relative p-10 rounded-sm dark:bg-stone-900 mb-16 overflow-hidden transition-colors duration-300 border border-stone-200/60 dark:border-stone-800/80 shadow-sm"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="halftone-bg absolute inset-0 pointer-events-none"></div>
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
          >
            <Logo className="size-10 text-viet-red mb-6 mx-auto" />
          </motion.div>
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
      </motion.div>
    </section>
  );
}
