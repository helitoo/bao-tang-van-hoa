"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection({
  locale,
  dict,
}: {
  locale: string;
  dict: any;
}) {
  return (
    <section className="relative h-[500px] overflow-hidden bg-stone-900 flex items-center justify-center">
      {/* Background Image with subtle cinematic zoom */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <img
          src="/bgs/bg.png"
          alt={dict.museum_name || "Bảo tàng Văn hóa"}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/15 to-black/40"></div>
      </motion.div>

      {/* Hero Content with staggered entrance */}
      <div className="relative z-10 text-center w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-white text-2xl md:text-5xl font-extrabold mb-6 drop-shadow-2xl leading-tight">
            {dict.hero_title} <br />{" "}
            <span className="text-white drop-shadow-lg font-medium">
              {dict.hero_subtitle}
            </span>
          </h2>
        </motion.div>

        {/* Decorative divider expanding horizontally */}
        <div className="flex justify-center mb-10">
          <motion.div
            className="h-1 w-24 bg-viet-red shadow-lg origin-center"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          ></motion.div>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <motion.div
            className="inline-block"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(185, 28, 28, 0.45)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href={`/${locale}/search`}
              className="btn bg-viet-red text-white px-6 py-3.5 rounded-sm transition-all inline-block text-sm font-extrabold uppercase tracking-widest shadow-md"
            >
              {dict.hero_btn}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
