import React, { useMemo, useEffect, useState, useRef } from "react";
// Fix: Use namespace import for react-router-dom to resolve export issues
import * as ReactRouterDOM from "react-router-dom";
const { useParams, Link } = ReactRouterDOM;
import { Artifact } from "../types";
import { CATEGORY_GROUPS } from "../constants";
import { useLanguage } from "../App";
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

const calculateJaccard = (setA: Set<any>, setB: Set<any>): number => {
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
};

const getWordSet = (text: string): Set<string> => {
  if (!text) return new Set();
  return new Set(
    text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 1),
  );
};

const ArtifactDetail: React.FC<ArtifactDetailProps> = ({ artifacts }) => {
  const { t, locale } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const sidebarRef = useRef<HTMLElement>(null);

  const [isSaved, setIsSaved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (sidebarRef.current) sidebarRef.current.scrollTop = 0;

    const saved = localStorage.getItem("saved_artifacts");
    if (saved && id) {
      const ids = JSON.parse(saved) as string[];
      setIsSaved(ids.includes(id));
    }

    const handleScrollLock = () => {
      if (window.innerWidth >= 768) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "auto";
    };
    handleScrollLock();
    window.addEventListener("resize", handleScrollLock);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", handleScrollLock);
    };
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
      .slice(0, 8);
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
    <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-5rem)] bg-white dark:bg-stone-900 transition-colors duration-300 md:overflow-hidden relative z-10">
      <div className="w-full h-[calc(100vh-5rem)] md:flex-1 relative bg-stone-100 dark:bg-stone-950 flex items-stretch justify-center overflow-hidden">
        {driveId ? (
          <iframe
            src={`https://drive.google.com/file/d/${driveId}/preview`}
            className="w-full h-full border-none bg-stone-200 dark:bg-stone-800"
            allow="autoplay"
            title={item.name}
          ></iframe>
        ) : (
          <div className="flex items-center justify-center w-full px-4 h-full bg-stone-50 dark:bg-stone-900/20">
            <img
              src={getLh3Url(item.main_image)}
              alt={item.name}
              className="max-w-full max-h-[90%] object-contain shadow-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
          </div>
        )}

        <div className="absolute top-4 left-4 z-40 flex items-center space-x-2 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md px-4 py-2 border border-stone-200 dark:border-stone-700 shadow-lg rounded-sm text-[10px] font-extrabold uppercase tracking-widest text-stone-500 dark:text-stone-400">
          <Link to="/" className="hover:text-viet-red transition-colors">
            {t("nav_home")}
          </Link>
          <span>/</span>
          <Link to="/search" className="hover:text-viet-red transition-colors">
            {t("nav_search")}
          </Link>
        </div>
      </div>

      <aside
        ref={sidebarRef}
        className="w-full md:w-[400px] lg:w-[450px] bg-white dark:bg-stone-900 md:border-l border-stone-200 dark:border-stone-800 flex flex-col h-auto md:h-full md:overflow-y-auto scroll-smooth transition-all duration-300"
      >
        <div className="p-8 space-y-10 flex-grow">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
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
            <p className="text-stone-500 dark:text-stone-400 font-medium italic text-sm border-l-2 border-stone-200 dark:border-stone-700 pl-4 py-1 leading-relaxed">
              {renderOrPlaceholder(item.short_description)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSave}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-sm text-[10px] font-extrabold uppercase tracking-widest border transition-all ${isSaved ? "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-viet-red" : "bg-viet-red text-white border-viet-red hover:bg-red-800"}`}
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
              <span>{isSaved ? t("btn_saved") : t("btn_save")}</span>
            </button>
            <button
              onClick={shareArtifact}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-sm text-[10px] font-extrabold uppercase tracking-widest bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-viet-red hover:text-viet-red transition-all relative"
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
              <span>
                {copySuccess ? t("btn_share_copied") : t("btn_share")}
              </span>
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-extrabold border-b border-stone-200 dark:border-stone-800 pb-2 dark:text-stone-200 flex items-center uppercase">
              <span className="w-2 h-2 bg-viet-red mr-3"></span>
              {t("artifact_desc")}
            </h3>
            <div className="text-stone-700 dark:text-stone-400 leading-relaxed whitespace-pre-wrap font-medium italic text-base text-justify">
              {renderOrPlaceholder(item.description)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-[13px] bg-stone-50 dark:bg-stone-800/40 p-5 border border-stone-100 dark:border-stone-800">
            <div className="space-y-1">
              <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest">
                {t("artifact_date")}
                <TooltipIcon text={t("tooltip_date")} />
              </span>
              <span className="font-extrabold text-stone-800 dark:text-stone-200 leading-tight block">
                {renderOrPlaceholder(item.artifact_date)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest">
                {t("artifact_location")}
                <TooltipIcon text={t("tooltip_location")} />
              </span>
              <span className="font-extrabold text-stone-800 dark:text-stone-200 leading-tight block">
                {renderOrPlaceholder(item.location)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest">
                {t("artifact_author")}
                <TooltipIcon text={t("tooltip_author")} />
              </span>
              <span className="font-extrabold text-stone-800 dark:text-stone-200 leading-tight block">
                {renderOrPlaceholder(item.author)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest">
                {t("artifact_contributor")}
                <TooltipIcon text={t("tooltip_contributor")} />
              </span>
              <span className="font-extrabold text-stone-800 dark:text-stone-200 leading-tight block">
                {renderOrPlaceholder(item.contributor)}
              </span>
            </div>
            <div className="col-span-2 pt-3 border-t border-stone-200 dark:border-stone-700 mt-1">
              <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest mb-1">
                {t("artifact_public_date")}
              </span>
              <span className="text-stone-600 dark:text-stone-400 text-[11px] font-medium italic">
                {renderOrPlaceholder(item.public_date)}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-extrabold border-b border-stone-200 dark:border-stone-800 pb-2 dark:text-stone-200 flex items-center uppercase">
              <span className="w-1.5 h-1.5 bg-stone-300 dark:bg-stone-600 mr-3"></span>
              {t("artifact_related")}
            </h3>
            {(item.supporting_images || []).length > 0 ? (
              <div className="space-y-3">
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

          <div className="space-y-6 pt-6 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 italic uppercase">
                {t("artifact_suggested")}
              </h3>
              <Link
                to="/search"
                className="text-[10px] font-extrabold uppercase tracking-widest text-viet-red hover:underline"
              >
                {t("see_all")}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {similarArtifacts.map((sim) => (
                <ArtifactCard key={sim.id} item={sim} compact />
              ))}
            </div>
          </div>
        </div>
        <Footer isSidebar />
      </aside>
    </div>
  );
};

export default ArtifactDetail;
