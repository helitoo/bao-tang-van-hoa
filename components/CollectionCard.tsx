"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import type { CollectionWithArtifacts } from "@/contexts/artifact";
import { getImgUrl, FALLBACK_IMAGE } from "@/lib/imgProcessor";

const MotionLink = motion.create(Link);

export default function CollectionCard({
  item,
  locale,
  dict,
}: {
  item: CollectionWithArtifacts;
  locale: string;
  dict?: any;
}) {
  const cover = item.coverImage || item.artifacts?.[0]?.main_image || "";
  const count = item.artifacts?.length || 0;
  const artifactUnit = dict?.artifacts || "hiện vật";

  return (
    <MotionLink
      href={`/${locale}/collection/${item.id}`}
      prefetch={true}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-viet-red/40 dark:hover:border-viet-red/40 transition-shadow duration-300 overflow-hidden flex flex-col h-full rounded-xs"
    >
      <div className="overflow-hidden relative bg-stone-100 dark:bg-stone-800 flex items-center justify-center aspect-square">
        <img
          src={getImgUrl(cover, 500)}
          alt={`${item.name} - Bộ sưu tập Hàm Anh Các`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          <span className="text-[9px] font-bold tracking-tight px-2 py-0.5 rounded-xs shadow-sm backdrop-blur-md text-white bg-viet-red/80 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.65 7.65a2 2 0 0 1 2.629-1.046l5.51 2.374a2 2 0 0 1 1.046 2.628l-3.957 9.184a2 2 0 0 1-2.628 1.046l-5.51-2.374a2 2 0 0 1-1.046-2.628z" />
              <path d="M18 7.777V4a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v10a2 2 0 0 0 1.137 1.805" />
              <path d="m8 4.389-4.364.809a2 2 0 0 0-1.602 2.33l1.822 9.833a2 2 0 0 0 2.331 1.602l2.542-.47" />
            </svg>
            <span>
              {count} {artifactUnit}
            </span>
          </span>
        </div>
      </div>
      <div className="p-3.5 flex-1 border-t border-stone-100 dark:border-stone-800 flex flex-col justify-between">
        <div>
          <h4
            title={item.name}
            className="font-bold text-sm group-hover:text-viet-red dark:text-stone-100 dark:group-hover:text-viet-red transition-colors mb-1.5 leading-snug line-clamp-2"
          >
            {item.name}
          </h4>
          {item.description ? (
            <p
              title={item.description}
              className="text-stone-500 dark:text-stone-400 text-[10px] leading-relaxed line-clamp-2 font-normal opacity-90"
            >
              {item.description}
            </p>
          ) : (
            <p className="text-stone-400 dark:text-stone-500 text-[10px] italic leading-relaxed">
              {dict?.collection_tag || "Bộ sưu tập chủ đề"}
            </p>
          )}
        </div>
      </div>
    </MotionLink>
  );
}
