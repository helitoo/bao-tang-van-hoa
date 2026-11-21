"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { Ref } from "@/app/[locale]/references/refs";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
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

export default function ReferenceSection({
  label,
  refs,
}: {
  label: React.ReactNode;
  refs: Ref[];
}) {
  if (!refs || refs.length === 0) return null;

  return (
    <motion.div
      className="mb-12 font-sans text-gray-800"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Label với đường gạch chân đặc trưng */}
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-bold tracking-widest text-viet-red mr-4 flex items-center">
          {label}
        </h2>
        <motion.div
          className="flex-1 h-px bg-stone-300 dark:bg-stone-700 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        />
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        {refs.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ x: 6 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="group border-l-2 border-stone-200 dark:border-stone-800 hover:border-viet-red! pl-4 transition-colors duration-200"
          >
            <h3 className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-viet-red transition-colors">
              {item.name}
            </h3>

            {item.sptName && (
              <h4 className="text-sm font-normal! tracking-tight text-stone-700 dark:text-stone-300">
                {item.sptName}
              </h4>
            )}

            {item.desc && (
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                {item.desc}
              </p>
            )}

            {item.url && (
              <Link
                href={item.url}
                target="_blank"
                className="mt-1 text-[10px] text-stone-400 dark:text-stone-500 leading-relaxed font-light hover:text-viet-red truncate block max-w-full transition-colors"
              >
                {item.url}
              </Link>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
