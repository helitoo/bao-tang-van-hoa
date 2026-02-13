import React from "react";
// Fix: Use namespace import for react-router-dom to resolve export issues
import * as ReactRouterDOM from "react-router-dom";
const { Link } = ReactRouterDOM;
import { Artifact } from "../types";
import { CATEGORY_GROUPS } from "../constants";
import { useLanguage } from "../App";

interface ArtifactCardProps {
  item: Artifact;
  compact?: boolean;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1558223108-637dc490190a?auto=format&fit=crop&q=80&w=800";

const BADGE_IDS = ["bvqg", "dtqg", "dtqgdb", "dstg"];

export const getDriveId = (url: string) => {
  if (!url) return null;
  const str = String(url).trim();
  const match =
    str.match(/\/file\/d\/(.+?)\/(view|preview|edit|copy)/) ||
    str.match(/id=(.+?)(&|$)/);
  return match ? match[1] : null;
};

export const getLh3Url = (content: string) => {
  if (!content) return FALLBACK_IMAGE;
  let url = String(content).trim();
  if (url.toLowerCase().startsWith("<iframe")) {
    const srcMatch = url.match(/src=["'](.+?)["']/i);
    if (srcMatch) url = srcMatch[1];
    else return FALLBACK_IMAGE;
  }
  const driveId = getDriveId(url);
  if (driveId) return `https://lh3.googleusercontent.com/d/${driveId}`;
  return url;
};

const ArtifactCard: React.FC<ArtifactCardProps> = ({
  item,
  compact = false,
}) => {
  const { locale } = useLanguage();
  const badges = (item.categories || [])
    .filter((id) => BADGE_IDS.includes(id))
    .map((id) => {
      for (const group of CATEGORY_GROUPS) {
        const found = group.options.find((opt) => opt.id === id);
        if (found) return { id, name: found.name[locale] };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <Link
      to={`/artifact/${item.id}`}
      className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="overflow-hidden relative bg-stone-100 dark:bg-stone-800 flex items-center justify-center aspect-square">
        <img
          src={getLh3Url(item.main_image)}
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
                className={`text-[8px] font-bold tracking-tighter px-1.5 py-0.5 rounded-sm shadow-sm backdrop-blur-md text-white ${badge?.id === "bvqg" ? "bg-amber-500/60" : badge?.id === "dstg" ? "bg-sky-400/60" : "bg-viet-red/60"}`}
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
};

export default ArtifactCard;
