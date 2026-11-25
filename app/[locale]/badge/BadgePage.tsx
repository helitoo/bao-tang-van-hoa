"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { type Badge, getBadges } from "@/lib/badgeManager";

export default function BadgePage({ dict }: { dict: any }) {
  const [badges, setBadges] = useState<Badge[] | undefined>();

  useEffect(() => {
    try {
      setBadges(getBadges());
    } catch (e) {
      console.error("Failed to load badges:", e);
      setBadges([]);
    }
  }, []);

  return (
    <div className="mb-12 font-sans text-gray-800 dark:text-stone-200 w-full mt-6">
      {badges && badges.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {badges.map((item, index) => (
            <motion.div
              key={item.name || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="flex flex-col items-center group m-2 sm:m-4 md:m-6 pb-5 p-5 rounded-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-lg transition-shadow"
            >
              <img
                src={item.url}
                alt={item.name}
                className="h-36 md:h-48 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                draggable={false}
              />

              <div className="flex-1 mt-4">
                <h3 className="transition-colors text-center break-words font-bold text-sm md:text-base text-stone-800 dark:text-stone-100 group-hover:text-viet-red">
                  {item.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="mt-16 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="70"
              height="70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heart-crack text-viet-red animate-pulse"
            >
              <path d="M12.409 5.824c-.702.792-1.15 1.496-1.415 2.166l2.153 2.156a.5.5 0 0 1 0 .707l-2.293 2.293a.5.5 0 0 0 0 .707L12 15" />
              <path d="M13.508 20.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.677.6.6 0 0 0 .818.001A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5z" />
            </svg>
            <h3 className="text-center font-normal whitespace-pre-line mt-4 text-stone-600 dark:text-stone-400">
              {dict.not_found_badge}
            </h3>
          </div>
        </motion.div>
      )}
    </div>
  );
}
