"use client";

import { useMemo } from "react";

import { useArtifact } from "@/contexts/artifact";
import { CATEGORY_GROUPS } from "@/lib/consts/categories";

import StatBarChart from "@/components/homepage/StatBarChart";
import { Locale } from "@/lib/lang";

export default function Statistics({
  locale,
  dict,
}: {
  locale: Locale;
  dict: any;
}) {
  const { artifacts } = useArtifact();

  const stats = useMemo(() => {
    if (!artifacts || artifacts.length <= 0) return null;

    const counts: Record<string, number> = {};
    artifacts.forEach((a) => {
      if (a.categories) {
        a.categories.forEach((catId) => {
          counts[catId] = (counts[catId] || 0) + 1;
        });
      }
    });

    const getGroupData = (groupId: string) => {
      const group = CATEGORY_GROUPS.find((g) => g.id === groupId);
      if (!group) return [];

      return group.options
        .map((opt) => ({
          label: opt.name[locale],
          count: counts[opt.id] || 0,
        }))
        .sort((a, b) => b.count - a.count);
    };

    return {
      total: artifacts.length,
      religion: getGroupData("religion"),
      genre: getGroupData("genre"),
      era: getGroupData("era"),
      region: getGroupData("region"),
    };
  }, [artifacts, locale]);

  return (
    <section className="max-w-7xl mx-auto px-2 md:px-4">
      <div className="flex flex-col items-center mb-8">
        <h3 className="text-2xl font-extrabold text-stone-800 dark:text-stone-200 mb-2 uppercase">
          {dict.stats_title}
        </h3>
        <div className="h-0.5 w-16 bg-stone-200 dark:bg-stone-800"></div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-2 md:gap-4 h-[650px] md:h-[500px]">
          {/* Ô (1; 1): Tổng số hiện vật - Trải dài 2 cột trên mobile */}
          <div
            className={`col-span-2 md:col-span-1 md:row-span-2 bg-white dark:bg-stone-800/50 p-4 border border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group ${!stats && "skeleton"}`}
          >
            {stats && (
              <>
                <div className="halftone-bg absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"></div>
                <span className="text-[8px] md:text-[10px] font-extralight uppercase tracking-[0.2em] text-stone-400 mb-2">
                  {dict.stats_total}
                </span>
                <span className="text-4xl md:text-6xl font-extrabold text-viet-red drop-shadow-sm tabular-nums">
                  {stats.total}
                </span>
              </>
            )}
          </div>

          {/* Ô (2, 1) Mobile / (1, 2) Desktop: Tôn giáo & Tín ngưỡng */}
          <StatBarChart
            title={dict.stats_religion}
            data={stats?.religion}
            total={stats?.total}
            className="col-start-1 md:col-start-2 row-start-2 md:row-start-1"
          />

          {/* Ô (2, 2) Mobile / (2, 2) Desktop: Phân loại Khu vực */}
          <StatBarChart
            title={dict.stats_region}
            data={stats?.region}
            total={stats?.total}
            className="col-start-2 md:col-start-2 row-start-2 md:row-start-2"
          />

          {/* Ô (3, 1) Mobile / (1-2, 3) Desktop: Phân loại Thể loại */}
          <StatBarChart
            title={dict.stats_genre}
            data={stats?.genre}
            total={stats?.total}
            className="col-start-1 md:col-start-3 row-start-3 md:row-start-1 md:row-span-2"
          />

          {/* Ô (3, 2) Mobile / (1-2, 4) Desktop: Phân loại Thời đại */}
          <StatBarChart
            title={dict.stats_era}
            data={stats?.era}
            total={stats?.total}
            className="col-start-2 md:col-start-4 row-start-3 md:row-start-1 md:row-span-2"
          />
        </div>
        <div className="flex justify-center">
          <span className="text-[10px] font-extralight uppercase tracking-widest text-stone-400 dark:text-stone-500 opacity-80 flex items-center">
            <span className="w-1 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mr-2"></span>
            {dict.home_update_note}
          </span>
        </div>
      </div>
    </section>
  );
}
