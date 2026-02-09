import React, { useMemo } from "react";
// Fix: Use namespace import for react-router-dom to resolve export issues
import * as ReactRouterDOM from "react-router-dom";
const { Link } = ReactRouterDOM;
import { Artifact } from "../types";
import { useLanguage } from "../App";
import ArtifactCard from "../components/ArtifactCard";
import { CATEGORY_GROUPS } from "../constants";

interface HomeProps {
  artifacts: Artifact[];
}

const StatBarChart = ({
  title,
  data,
  total,
  className = "",
}: {
  title: string;
  data: { label: string; count: number }[];
  total: number;
  className?: string;
}) => {
  return (
    <div
      className={`bg-white dark:bg-stone-800/50 p-3 md:p-5 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col transition-colors duration-300 ${className}`}
    >
      <h4 className="text-[9px] md:text-[10px] font-extralight uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3 border-b border-stone-100 dark:border-stone-800 pb-2 flex items-center flex-shrink-0">
        <span className="w-1 h-1 bg-viet-red mr-2"></span>
        {title}
      </h4>
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-2.5">
        {data.map((item, idx) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[8px] md:text-[9px] font-medium text-stone-600 dark:text-stone-400">
                <span className="truncate pr-1">{item.label}</span>
                <span className="font-bold tabular-nums">{item.count}</span>
              </div>
              <div className="w-full h-0.5 bg-stone-100 dark:bg-stone-900 overflow-hidden">
                <div
                  className="h-full bg-viet-red transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.max(percentage, item.count > 0 ? 1 : 0)}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Home: React.FC<HomeProps> = ({ artifacts }) => {
  const { t, locale } = useLanguage();

  const stats = useMemo(() => {
    if (!artifacts || artifacts.length === 0) return null;

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

  const handleDownloadAIFile = () => {
    if (!artifacts || artifacts.length === 0) return;

    const getCatNames = (ids: string[]) => {
      return (ids || [])
        .map((id) => {
          for (const group of CATEGORY_GROUPS) {
            const found = group.options.find((opt) => id === opt.id);
            if (found) return found.name[locale];
          }
          return id;
        })
        .join("; ");
    };

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      "ID",
      "Name",
      "Short Description",
      "Description",
      "Categories",
      "Main Image URL",
      "Supporting Images",
      "Sources",
      "Author",
      "Contributor",
      "Artifact Date/Era",
      "Public Date",
      "Location",
    ];

    const rows = artifacts.map((a) => [
      escapeCSV(a.id),
      escapeCSV(a.name),
      escapeCSV(a.short_description),
      escapeCSV(a.description),
      escapeCSV(getCatNames(a.categories)),
      escapeCSV(a.main_image),
      escapeCSV((a.supporting_images || []).join("; ")),
      escapeCSV((a.sources || []).join("; ")),
      escapeCSV(a.author),
      escapeCSV(a.contributor),
      escapeCSV(a.artifact_date),
      escapeCSV(a.public_date),
      escapeCSV(a.location),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const now = new Date();
    const dateStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    link.href = url;
    link.setAttribute("download", `btvh-hienvat-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-16">
      <section className="relative h-[500px] overflow-hidden bg-stone-900 flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="background.webp"
            alt="Khuê văn các"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/40 to-stone-900/80"></div>
        </div>
        <div className="relative z-10 text-center w-full">
          <h2 className="text-white text-2xl md:text-5xl font-extrabold mb-6 drop-shadow-2xl leading-tight">
            {t("hero_title")} <br />{" "}
            <span className="text-white drop-shadow-lg font-medium">
              {t("hero_subtitle")}
            </span>
          </h2>
          <div className="flex justify-center mb-10">
            <div className="h-1 w-24 bg-viet-red shadow-lg"></div>
          </div>
          <Link
            to="/search"
            className="bg-viet-red hover:bg-red-800 text-white px-12 py-4 rounded-sm transition-all transform hover:scale-105 inline-block text-sm font-extrabold uppercase tracking-widest shadow-2xl border border-red-700/50"
          >
            {t("hero_btn")}
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 text-center relative">
        <div className="mb-12 flex flex-col items-center">
          <h1 className="text-stone-900 dark:text-stone-100 text-4xl md:text-5xl font-extrabold mb-2 tracking-tight uppercase">
            {t("museum_name")}
          </h1>
          <span className="text-stone-400 dark:text-stone-500 text-xs font-extralight tracking-[0.5em] uppercase opacity-70">
            {t("museum_sub")}
          </span>
        </div>

        <div className="relative p-10 border-2 border-stone-200 dark:border-stone-800 rounded-sm bg-white dark:bg-stone-900 shadow-inner mb-16 overflow-hidden transition-colors duration-300">
          <div className="halftone-bg absolute inset-0 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <svg
                className="w-10 h-10 text-viet-red opacity-80"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 18z" />
              </svg>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-stone-800 dark:text-stone-200 mb-4 leading-relaxed px-4">
              {t("mission_title")}
            </p>
            <p className="text-viet-red font-extrabold uppercase text-xs tracking-widest opacity-90">
              {t("mission_author")}
            </p>
            <div className="mt-10 text-stone-600 dark:text-stone-400 leading-relaxed text-lg max-w-2xl mx-auto font-medium">
              {t("mission_desc")}
            </div>
          </div>
        </div>
      </section>

      {/* Rigid Dashboard: Adapted for Mobile & Desktop */}
      <section className="max-w-7xl mx-auto px-2 md:px-4">
        <div className="flex flex-col items-center mb-8">
          <h3 className="text-2xl font-extrabold text-stone-800 dark:text-stone-200 mb-2 uppercase">
            {t("stats_title")}
          </h3>
          <div className="h-0.5 w-16 bg-stone-200 dark:bg-stone-800"></div>
        </div>

        {stats && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-2 md:gap-4 h-[650px] md:h-[500px]">
              {/* Ô (1; 1): Tổng số hiện vật - Trải dài 2 cột trên mobile */}
              <div className="col-span-2 md:col-span-1 md:row-span-2 bg-white dark:bg-stone-800/50 p-4 border border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
                <div className="halftone-bg absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"></div>
                <span className="text-[8px] md:text-[10px] font-extralight uppercase tracking-[0.2em] text-stone-400 mb-2">
                  {t("stats_total")}
                </span>
                <span className="text-4xl md:text-6xl font-extrabold text-viet-red drop-shadow-sm tabular-nums">
                  {stats.total}
                </span>
              </div>

              {/* Ô (2, 1) Mobile / (1, 2) Desktop: Tôn giáo & Tín ngưỡng */}
              <StatBarChart
                title={t("stats_religion")}
                data={stats.religion}
                total={stats.total}
                className="col-start-1 md:col-start-2 row-start-2 md:row-start-1"
              />

              {/* Ô (2, 2) Mobile / (2, 2) Desktop: Phân loại Khu vực */}
              <StatBarChart
                title={t("stats_region")}
                data={stats.region}
                total={stats.total}
                className="col-start-2 md:col-start-2 row-start-2 md:row-start-2"
              />

              {/* Ô (3, 1) Mobile / (1-2, 3) Desktop: Phân loại Thể loại */}
              <StatBarChart
                title={t("stats_genre")}
                data={stats.genre}
                total={stats.total}
                className="col-start-1 md:col-start-3 row-start-3 md:row-start-1 md:row-span-2"
              />

              {/* Ô (3, 2) Mobile / (1-2, 4) Desktop: Phân loại Thời đại */}
              <StatBarChart
                title={t("stats_era")}
                data={stats.era}
                total={stats.total}
                className="col-start-2 md:col-start-4 row-start-3 md:row-start-1 md:row-span-2"
              />
            </div>
            <div className="flex justify-center">
              <span className="text-[10px] font-extralight uppercase tracking-widest text-stone-400 dark:text-stone-500 opacity-80 flex items-center">
                <span className="w-1 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mr-2"></span>
                {t("home_update_note")}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* AI Advanced Search Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-stone-900 dark:bg-stone-800 text-stone-100 p-8 md:p-12 border-4 border-viet-red relative overflow-hidden group shadow-2xl">
          <div className="halftone-bg absolute inset-0 opacity-[0.05]"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-viet-red flex items-center justify-center rounded-full">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
                  {t("ai_search_title")}
                </h3>
              </div>
              <p className="text-stone-400 text-lg leading-relaxed max-w-2xl font-medium">
                {t("ai_search_desc")}
              </p>
              <div className="bg-stone-950/80 border-l-4 border-viet-red p-6 font-medium text-stone-300 leading-relaxed shadow-inner">
                "{t("ai_search_prompt")}"
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={handleDownloadAIFile}
                className="bg-viet-red hover:bg-red-800 text-white px-10 py-5 rounded-sm transition-all transform hover:scale-105 active:scale-95 font-extrabold uppercase tracking-widest text-sm shadow-xl flex items-center space-x-3 group"
              >
                <svg
                  className="w-5 h-5 group-hover:translate-y-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>{t("ai_search_btn")}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-8 border-b-2 border-stone-200 dark:border-stone-800 pb-4">
          <h3 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 uppercase">
            {t("featured_title")}
          </h3>
          <Link
            to="/search"
            className="text-xs font-extrabold uppercase tracking-widest text-viet-red hover:underline transition-all"
          >
            {t("see_all")}
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {artifacts && artifacts.length > 0 ? (
            artifacts
              .slice(0, 12)
              .map((item) => <ArtifactCard key={item.id} item={item} />)
          ) : (
            <div className="col-span-full py-12 text-center text-stone-400 font-medium">
              Đang cập nhật hiện vật...
            </div>
          )}
        </div>
      </section>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 2px; } .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #44403c; }`}</style>
    </div>
  );
};

export default Home;
