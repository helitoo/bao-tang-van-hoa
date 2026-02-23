import Link from "next/link";

import type { Locale } from "@/lib/lang";
import type { Artifact } from "@/contexts/artifact";
import { CATEGORY_GROUPS } from "@/lib/consts/categories";

import { getImgUrl, FALLBACK_IMAGE } from "@/lib/imgProcessor";

const BADGE_IDS = ["bvqg", "dtqg", "dtqgdb", "dstg"];

export default function ArtifactCard({
  item,
  locale,
}: {
  item: Artifact;
  locale: string;
}) {
  const badges = (item.categories || [])
    .filter((id) => BADGE_IDS.includes(id))
    .map((id) => {
      for (const group of CATEGORY_GROUPS) {
        const found = group.options.find((opt) => opt.id === id);
        if (found) return { id, name: found.name[locale as Locale] };
      }
      return null;
    })
    .filter(Boolean)
    .sort();

  return (
    <Link
      href={`/${locale}/artifact/${item.id}`}
      className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="overflow-hidden relative bg-stone-100 dark:bg-stone-800 flex items-center justify-center aspect-square">
        <img
          src={getImgUrl(item.main_image)}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        {badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
            {badges.map((badge) => (
              <span
                key={badge?.id}
                className={`text-[8px] font-bold tracking-tighter px-1.5 py-0.5 rounded-sm shadow-sm backdrop-blur-md text-white ${badge?.id === "bvqg" ? "bg-amber-500/50" : badge?.id === "dstg" ? "bg-sky-400/50" : "bg-lime-400/50"}`}
              >
                {badge?.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-3 flex-1 border-t border-stone-100 dark:border-stone-800 flex flex-col">
        <h4
          className={`font-semibold group-hover:text-viet-red dark:text-stone-100 dark:group-hover:text-viet-red transition-colors mb-1 leading-tight line-clamp-2`}
        >
          {item.name}
        </h4>
        <p className="text-stone-500 dark:text-stone-400 text-[9px] line-clamp-1 leading-relaxed italic opacity-80 font-medium mt-auto leading-tight line-clamp-2">
          {item.short_description}
        </p>
      </div>
    </Link>
  );
}
