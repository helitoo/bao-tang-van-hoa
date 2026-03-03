"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { ToastContainer, toast, Bounce } from "react-toastify";

import type { Locale } from "@/lib/lang";
import similarityScore from "@/lib/fuzzySearching";
import { getCategoryNames, getCategoryName } from "@/lib/consts/categories";
import { getDriveId, getImgUrl, FALLBACK_IMAGE } from "@/lib/imgProcessor";

import type { Artifact } from "@/contexts/artifact";
import { useArtifact } from "@/contexts/artifact";

import ArtifactCard from "@/components/ArtifactCard";

import TooltipIcon from "@/app/[locale]/artifact/[aid]/TooltipIcon";
import ReferenceItem from "@/app/[locale]/artifact/[aid]/ReferenceItem";

import { setInfo } from "@/lib/badgeManager";

export default function Artifact({
  locale,
  dict,
  aid,
}: {
  locale: Locale;
  dict: any;
  aid: string;
}) {
  // Artifact info handler

  const [artifact, setArtifact] = useState<Artifact | undefined>(undefined);
  const [driveId, setDriveId] = useState<string | undefined>();
  const [notFound, setNotFound] = useState<boolean>(false);

  const { artifacts } = useArtifact();

  useEffect(() => {
    if (!artifacts) return;
    const foundedArtifact = artifacts.find((a) => a.id === aid);
    if (foundedArtifact) setArtifact(foundedArtifact);
    else setNotFound(true);
  }, [artifacts]);

  useEffect(() => {
    if (!artifact) return;
    setDriveId(getDriveId(artifact.main_image) || undefined);
  }, [artifact]);

  // Find similar artifacts handler

  const [similarArtifacts, setSimilarArtifacts] = useState<
    Artifact[] | undefined
  >();

  useEffect(() => {
    if (!artifact || !artifacts) return;

    const currCatName = getCategoryNames(artifact.categories, locale);

    setSimilarArtifacts(
      artifacts
        .filter((a) => a.id !== artifact.id)
        .map((a) => {
          const nameScore = similarityScore(
            `${artifact.name} ${artifact.short_description || ""}`,
            `${a.name} ${a.short_description || ""}`,
          );

          const descScore = similarityScore(
            artifact.description || "",
            a.description || "",
          );

          const catScore = similarityScore(
            currCatName,
            getCategoryNames(a.categories, locale),
          );

          return {
            ...a,
            similarityScore: nameScore * 0.5 + descScore * 0.4 + catScore * 0.1,
          };
        })
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 12),
    );
  }, [artifact, artifacts]);

  // Render (None) if the value is falsy

  const renderOrPlaceholder = (val?: string) =>
    !val || val.trim() === "" ? dict.placeholder_none : val;

  // Save artifact handler

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!artifact) return;

    const saved = localStorage.getItem("saved_artifacts");
    let savedAids: string[] = saved ? JSON.parse(saved) : [];

    setIsSaved(savedAids.includes(aid));
  }, [artifact]);

  const toggleSave = () => {
    if (!artifact) return;

    const saved = localStorage.getItem("saved_artifacts");
    let savedAids: string[] = saved ? JSON.parse(saved) : [];

    // save
    if (!isSaved) {
      savedAids.push(artifact.id);
      setIsSaved(true);
    }
    // un save
    else {
      const index = savedAids.indexOf(artifact.id);
      if (index !== -1) {
        savedAids.splice(index, 1);
        setIsSaved(false);
      }
    }

    localStorage.setItem("saved_artifacts", JSON.stringify(savedAids));
  };

  // Share artifact handler

  const [copySuccess, setCopySuccess] = useState(false);

  const shareArtifact = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Popup window state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Badge infor processing
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function handle() {
      const maxBadge = await setInfo();
      if (maxBadge) {
        toast.success(`${dict.new_badge_cong}${maxBadge.name}!!`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    }

    handle();
  }, []);

  return (
    <>
      <ToastContainer />
      {notFound ? (
        <div className="mt-25 flex items-center justify-center">
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
              className="lucide lucide-heart-crack-icon lucide-heart-crack text-viet-red"
            >
              <path d="M12.409 5.824c-.702.792-1.15 1.496-1.415 2.166l2.153 2.156a.5.5 0 0 1 0 .707l-2.293 2.293a.5.5 0 0 0 0 .707L12 15" />
              <path d="M13.508 20.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.677.6.6 0 0 0 .818.001A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5z" />
            </svg>
            <h3 className="text-center font-normal whitespace-pre-line">
              {dict.not_found}
            </h3>
          </div>
        </div>
      ) : (
        <>
          {/* Main Section */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-16">
            {/* Left: Image */}
            <div
              className={`relative w-full md:w-1/2 lg:w-3/5 ${!artifact && "skeleton w-full h-50 rounded"}`}
            >
              {artifact && (
                <>
                  <img
                    src={getImgUrl(artifact.main_image)}
                    alt={artifact.name}
                    className="max-w-full max-h-full object-contain cursor-pointer shadow"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}
                  />

                  {/* Enlarge Button - Moved to top right, no hover effects */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full shadow-lg z-20 bg-black/70 hover:bg-black/50 text-stone-300"
                    aria-label="Enlarge"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Right: Info */}
            <div
              className={`w-full md:w-1/2 lg:w-2/5 space-y-8 ${!artifact && "skeleton w-full h-50 rounded"}`}
            >
              {artifact && (
                <>
                  <div className="space-y-4">
                    <h1 className="text-2xl lg:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
                      {artifact.name}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                      {(artifact.categories || []).map((cataid) => {
                        const name = getCategoryName(cataid, locale);
                        return (
                          name && (
                            <span
                              key={cataid}
                              className="text-[9px] font-extrabold bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-2 py-1 border border-stone-200 dark:border-stone-700"
                            >
                              {name}
                            </span>
                          )
                        );
                      })}
                    </div>
                    <p className="text-stone-500 dark:text-stone-400 font-medium italic border-l-4 border-viet-red pl-6 py-2 leading-relaxed bg-stone-100/50 dark:bg-stone-800/30">
                      {renderOrPlaceholder(artifact.short_description)}
                    </p>
                  </div>

                  {/* Buttons Row */}
                  <div className="w-full flex items-center gap-3">
                    <button
                      onClick={toggleSave}
                      className={`btn w-40 h-10 flex items-center justify-center space-x-2 rounded-sm tracking-widest border transition-all shrink-0 ${isSaved ? "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-viet-red" : "bg-viet-red text-white border-viet-red hover:bg-red-800"}`}
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
                        {isSaved ? dict.btn_saved : dict.btn_save}
                      </span>
                    </button>
                    <button
                      onClick={shareArtifact}
                      className="btn w-40 h-10 flex items-center justify-center space-x-2 rounded-sm tracking-widest bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-viet-red hover:text-viet-red transition-all shrink-0"
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
                        {copySuccess ? dict.btn_share_copied : dict.btn_share}
                      </span>
                    </button>
                  </div>

                  {/* Short description and Detail description */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-extrabold border-b-2 border-stone-200 dark:border-stone-800 pb-2 dark:text-stone-100 flex items-center uppercase tracking-tight">
                      <span className="w-3 h-3 bg-viet-red mr-3"></span>
                      {dict.artifact_desc}
                    </h3>
                    <div className="text-stone-700 dark:text-stone-400 leading-relaxed whitespace-pre-wrap font-medium text-base text-justify">
                      {renderOrPlaceholder(artifact.description)}
                    </div>
                  </div>

                  {/* Other infors */}
                  <div className="grid grid-cols-2 gap-4 text-[13px] bg-white dark:bg-stone-800/50 p-6 border border-stone-200 dark:border-stone-700 shadow-sm">
                    <div className="space-y-1">
                      <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest">
                        {dict.artifact_date}
                        <TooltipIcon text={dict.tooltip_date} />
                      </span>
                      <span className="font-bold text-stone-800 dark:text-stone-200 leading-tight block">
                        {renderOrPlaceholder(artifact.artifact_date)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest">
                        {dict.artifact_location}
                        <TooltipIcon text={dict.tooltip_location} />
                      </span>
                      <span className="font-bold text-stone-800 dark:text-stone-200 leading-tight block">
                        {renderOrPlaceholder(artifact.location)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest">
                        {dict.artifact_author}
                        <TooltipIcon text={dict.tooltip_author} />
                      </span>
                      <span className="font-bold text-stone-800 dark:text-stone-200 leading-tight block">
                        {renderOrPlaceholder(artifact.author)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-stone-400 dark:text-stone-500 font-extralight uppercase text-[9px] tracking-widest">
                        {dict.artifact_contributor}
                        <TooltipIcon text={dict.tooltip_contributor} />
                      </span>
                      <span className="font-bold text-stone-800 dark:text-stone-200 leading-tight block">
                        {renderOrPlaceholder(artifact.contributor)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-extrabold border-b-2 border-stone-200 dark:border-stone-800 pb-2 dark:text-stone-100 flex items-center uppercase tracking-tight">
                      <span className="w-3 h-3 bg-stone-300 dark:bg-stone-600 mr-3"></span>
                      {dict.artifact_related}
                    </h3>
                    {(artifact.supporting_images || []).length > 0 ? (
                      <div className="graid graid-cols-1 gap-3">
                        {(artifact.supporting_images || []).map((url, aidx) => (
                          <ReferenceItem key={aidx} url={url} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs italic text-stone-400 font-medium">
                        {dict.placeholder_none}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Suggested Section*/}
          <div className="pt-16 border-t-2 border-stone-200 dark:border-stone-800 mb-16 w-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-tighter">
                {dict.artifact_suggested}
              </h3>
              <Link
                href={`/${locale}/search`}
                hrefLang={locale}
                className="text-[11px] font-extrabold uppercase tracking-widest text-viet-red hover:underline decoration-2 underline-offset-4"
              >
                {dict.see_all}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 w-full">
              {similarArtifacts ? (
                <>
                  {similarArtifacts.map((sim) => (
                    <ArtifactCard key={sim.id} item={sim} locale={locale} />
                  ))}
                </>
              ) : (
                <div className="w-full h-20 skeleton rounded"></div>
              )}
            </div>
          </div>

          {/* Popup Modal */}
          {isModalOpen && artifact && (
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
                    title={artifact.name}
                  ></iframe>
                ) : (
                  <img
                    src={getImgUrl(artifact.main_image)}
                    alt={artifact.name}
                    className="max-w-full max-h-full object-contain"
                  />
                )}

                {/* Close Button at Maiddle Right Edge */}
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-0 mr-9 md:mr-4 bg-black/70 hover:bg-black/50 text-stone-300 p-2 rounded-full shadow-2xl z-[110]"
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
        </>
      )}
    </>
  );
}
