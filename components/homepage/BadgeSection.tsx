"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/lang";

export default function BadgeSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: any;
}) {
  return (
    <section className="max-w-7xl mx-auto px-2 md:px-4 flex flex-col justify-center items-center">
      <motion.div
        className="w-full flex justify-center"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src="/badge/badge-bg.png"
          alt="Badge Background"
          className="mx-auto w-full md:w-2/3 h-auto drop-shadow-md select-none"
          draggable={false}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </motion.div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link
            href={`/${locale}/badge`}
            className="btn bg-viet-red text-white px-6 py-3 rounded-sm transition-all shadow-md inline-block text-sm font-extrabold uppercase tracking-widest"
          >
            {dict.nav_badge}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
