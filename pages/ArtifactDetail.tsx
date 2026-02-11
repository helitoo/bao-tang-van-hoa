import React, { useMemo, useEffect, useState } from "react";
import * as ReactRouterDOM from "react-router-dom";
const { useParams, Link } = ReactRouterDOM;
import { Artifact } from "../types";
import { CATEGORY_GROUPS } from "../constants";
import { useLanguage } from "../App";
import { calculateJaccard, getWordSet } from "../fuzzy-searching";
import ArtifactCard, {
  getDriveId,
  getLh3Url,
} from "../components/ArtifactCard";
import ReferenceItem from "../components/ReferenceItem";
import Footer from "../components/Footer";

interface ArtifactDetailProps {
  artifacts: Artifact[];
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1558223108-637dc490190a?auto=format&fit=crop&q=80&w=800";

const TooltipIcon: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-flex ml-1 align-middle">
    <svg
      className="w-3 h-3 text-stone-400 dark:text-stone-500 hover:text-viet-red dark:hover:text-viet-red cursor-help transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-stone-900 dark:bg-stone-800 text-white text-[10px] font-medium normal-case leading-relaxed rounded shadow-xl z-[60] text-center border border-stone-700 dark:border-stone-600 animate-in fade-in slide-in-from-bottom-1">
      {text}
      <div className="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-stone-900 dark:border-t-stone-800"></div>
    </div>
  </div>
);

const ArtifactDetail: React.FC<ArtifactDetailProps> = ({ artifacts }) => {
  const { t, locale } = useLanguage();
  const { id } = useParams<{ id: string }>();

  const [isSaved, setIsSaved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const saved = localStorage.getItem("saved_artifacts");
    if (saved && id) {
      const ids = JSON.parse(saved) as string[];
      setIsSaved(ids.includes(id));
    }
  }, [id]);

  const toggleSave = () => {
    if (!id) return;
    const saved = localStorage.getItem("saved_artifacts");
    let ids: string[] = saved ? JSON.parse(saved) : [];
    if (ids.includes(id)) {
      ids = ids.filter((savedId) => savedId !== id);
      setIsSaved(false);
    } else {
      ids.push(id);
      setIsSaved(true);
    }
    localStorage.setItem("saved_artifacts", JSON.stringify(ids));
  };

  const shareArtifact = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const item = useMemo(
    () => artifacts.find((a) => a.id === id),
    [artifacts, id],
  );

  const similarArtifacts = useMemo(() => {
    if (!item || !artifacts) return [];
    const currentNameSet = getWordSet(item.name);
    const currentDescSet = getWordSet(
      (item.short_description || "") + " " + (item.description || ""),
    );
    const currentCatSet = new Set(item.categories || []);

    return artifacts
      .filter((a) => a.id !== item.id)
      .map((a) => {
        const nameScore =
          calculateJaccard(currentNameSet, getWordSet(a.name)) * 50;
        const descScore =
          calculateJaccard(
            currentDescSet,
            getWordSet(
              (a.short_description || "") + " " + (a.description || ""),
            ),
          ) * 30;
        const catScore =
          calculateJaccard(currentCatSet, new Set(a.categories || [])) * 20;
        return { ...a, similarityScore: nameScore + descScore + catScore };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 12);
  }, [item, artifacts]);

  if (!item)
    return (
      <div className="py-32 text-center text-stone-400 font-medium">
        Not Found
      </div>
    );

  const driveId = getDriveId(item.main_image);
  const getCategoryName = (catId: string) => {
    for (const group of CATEGORY_GROUPS) {
      const found = group.options.find((opt) => opt.id === catId);
      if (found) return found.name[locale];
    }
    return null;
  };

  const renderOrPlaceholder = (val?: string) =>
    !val || val.trim() === "" || val.toLowerCase() === "abc"
      ? t("placeholder_none")
      : val;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-6">
          <Link to="/" className="hover:text-viet-red transition-colors">
            {t("nav_home")}
          </Link>
          <span>/</span>
          <Link to="/search" className="hover:text-viet-red transition-colors">
            {t("nav_search")}
          </Link>
        </nav>

        {/* Main Section */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-16">
          {/* Left: Image */}
          <div className="w-full md:w-1/2 lg:w-3/5">
            <div
              className="bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 shadow-xl relative overflow-hidden aspect-square flex items-center justify-center p-2 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="absolute inset-0 bg-stone-100 dark:bg-stone-900/50 -z-10 halftone-bg opacity-10"></div>
              <img
                src={getLh3Url(item.main_image)}
                alt={item.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />

              {/* Enlarge Button - Moved to top right, no hover effects */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="absolute top-4 right-4 bg-white/95 dark:bg-stone-900/95 p-3 rounded-full shadow-lg border border-stone-200 dark:border-stone-700 text-viet-red z-20"
                aria-label="Enlarge"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H9"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-1/2 lg:w-2/5 space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
                {item.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                {(item.categories || []).map((catId) => {
                  const name = getCategoryName(catId);
                  return (
                    name && (
                      <span
                        key={catId}
                        className="text-[9px] font-extrabold bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-2 py-1 border border-stone-200 dark:border-stone-700"
                      >
                        {name}
                      </span>
                    )
                  );
                })}
              </div>
              <p className="text-stone-500 dark:text-stone-400 font-medium italic border-l-4 border-viet-red pl-6 py-2 leading-relaxed bg-stone-100/50 dark:bg-stone-800/30">
                {renderOrPlaceholder(item.short_description)}
              </p>
            </div>

            {/* Buttons Row - Fixed Size */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSave}
                className={`w-40 h-10 flex items-center justify-center space-x-2 rounded-sm tracking-widest border transition-all shrink-0 ${isSaved ? "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-viet-red" : "bg-viet-red text-white border-viet-red hover:bg-red-800"}`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isSaved ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <span className="whitespace-nowrap text-sm">
                  {isSaved ? t("btn_saved") : t("btn_save")}
                </span>
              </button>
              <button
                onClick={shareArtifact}
                className="w-40 h-10 flex items-center justify-center space-x-2 rounded-sm tracking-widest bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-viet-red hover:text-viet-red transition-all shrink-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="whitespace-nowrap text-sm">
                  {copySuccess ? t("btn_share_copied") : t("btn_share")}
                </span>
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-extrabold border-b-2 border-stone-200 dark:border-stone-800 pb-2 dark:text-stone-100 flex items-center uppercase tracking-tight">
                <span className="w-3 h-3 bg-viet-red mr-3 shadow-sm"></span>
                {t("artifact_desc")}
              </h3>
              <div className="text-stone-700 dark:text-stone-400 leading-relaxed whitespace-pre-wrap font-medium text-base text-justify">
                {renderOrPlaceholder(item.description)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[13px] bg-white dark:bg-stone-800/50 p-6 border border-stone-200 dark:border-stone-700 shadow-sm">
              <div className="space-y-1">
                <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest">
                  {t("artifact_date")}
                  <TooltipIcon text={t("tooltip_date")} />
                </span>
                <span className="font-bold text-stone-800 dark:text-stone-200 leading-tight block">
                  {renderOrPlaceholder(item.artifact_date)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest">
                  {t("artifact_location")}
                  <TooltipIcon text={t("tooltip_location")} />
                </span>
                <span className="font-bold text-stone-800 dark:text-stone-200 leading-tight block">
                  {renderOrPlaceholder(item.location)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest">
                  {t("artifact_author")}
                  <TooltipIcon text={t("tooltip_author")} />
                </span>
                <span className="font-bold text-stone-800 dark:text-stone-200 leading-tight block">
                  {renderOrPlaceholder(item.author)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest">
                  {t("artifact_contributor")}
                  <TooltipIcon text={t("tooltip_contributor")} />
                </span>
                <span className="font-bold text-stone-800 dark:text-stone-200 leading-tight block">
                  {renderOrPlaceholder(item.contributor)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-extrabold border-b-2 border-stone-200 dark:border-stone-800 pb-2 dark:text-stone-100 flex items-center uppercase tracking-tight">
                <span className="w-2 h-2 bg-stone-300 dark:bg-stone-600 mr-3"></span>
                {t("artifact_related")}
              </h3>
              {(item.supporting_images || []).length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {(item.supporting_images || []).map((url, idx) => (
                    <ReferenceItem key={idx} url={url} />
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-stone-400 font-medium">
                  {t("placeholder_none")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Suggested Section - Full Width Below */}
        <div className="pt-16 border-t-2 border-stone-200 dark:border-stone-800 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-tighter">
              {t("artifact_suggested")}
            </h3>
            <Link
              to="/search"
              className="text-[11px] font-extrabold uppercase tracking-widest text-viet-red hover:underline decoration-2 underline-offset-4"
            >
              {t("see_all")}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {similarArtifacts.map((sim) => (
              <ArtifactCard key={sim.id} item={sim} />
            ))}
          </div>
        </div>

        <Footer />
      </div>

      {/* Popup Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>

          <div
            className="relative w-full max-w-6xl h-full max-h-[90vh] bg-stone-950 shadow-2xl rounded-sm overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {driveId ? (
              <iframe
                src={`https://drive.google.com/file/d/${driveId}/preview`}
                className="w-full h-full border-none"
                allow="autoplay"
                title={item.name}
              ></iframe>
            ) : (
              <img
                src={getLh3Url(item.main_image)}
                alt={item.name}
                className="max-w-full max-h-full object-contain"
              />
            )}

            {/* Close Button at Middle Right Edge */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-0 md:mr-4 bg-viet-red hover:bg-red-800 text-white p-3 rounded-full shadow-2xl z-[110]"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtifactDetail;
