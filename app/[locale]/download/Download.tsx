"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useArtifact } from "@/contexts/artifact";
import { FULL_HEADERS } from "@/lib/exportData/dataMetadata";
import { getCsvContent } from "@/lib/exportData/getCsvContent";
import { getTxtContent } from "@/lib/exportData/getTxtContent";

import type { Locale } from "@/lib/lang";

const defaultCheckedHeaders: string[] = [
  "id",
  "name",
  "short_description",
  "description",
  "categories",
  "author",
  "artifact_date",
  "location",
];

export default function Download({
  dict,
  locale,
}: {
  dict: any;
  locale: Locale;
}) {
  const { artifacts } = useArtifact();

  // Checker state
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>(
    FULL_HEADERS.reduce(
      (acc, { key }) => {
        acc[key] = defaultCheckedHeaders.includes(key);
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleChange = (header: string) => {
    setCheckedState((prev) => ({
      ...prev,
      [header]: !prev[header],
    }));
  };

  const handleSelectAll = () => {
    setCheckedState(
      FULL_HEADERS.reduce(
        (acc, { key }) => {
          acc[key] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    );
  };

  const handleResetDefault = () => {
    setCheckedState(
      FULL_HEADERS.reduce(
        (acc, { key }) => {
          acc[key] = defaultCheckedHeaders.includes(key);
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    );
  };

  // Find max artifact public date
  const [maxPublicDate, setMaxPublicDate] = useState<string>("latest");

  useEffect(() => {
    if (!artifacts || artifacts.length === 0) return;
    const dateStr = artifacts[0]?.public_date?.replaceAll("/", "-") || "latest";
    setMaxPublicDate(dateStr);
  }, [artifacts]);

  // Handle download
  const handleDownloadData = (
    fileName: string,
    fileType: "text/csv;charset=utf-8" | "text/plain;charset=utf-8",
  ) => {
    if (!artifacts || artifacts.length === 0) return;

    const selectedHeaders = FULL_HEADERS.filter(({ key }) => checkedState[key]);

    const content =
      fileType === "text/csv;charset=utf-8"
        ? getCsvContent(artifacts, selectedHeaders)
        : getTxtContent(artifacts, selectedHeaders);

    const blob = new Blob(["\uFEFF" + content], {
      type: fileType,
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(fileName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const selectedCount = Object.values(checkedState).filter(Boolean).length;

  return (
    <motion.div
      className="mt-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm p-6 md:p-8 shadow-sm transition-colors text-left"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Field Selection */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-viet-red rounded-full"></span>
                {dict.download_field_options || "Tùy chọn trường thông tin"}
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {dict.download_selected || "Đã chọn"} {selectedCount} / {FULL_HEADERS.length} {dict.download_fields_unit || "trường"}
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSelectAll}
                className="text-[10px] font-bold px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:text-viet-red rounded-xs border border-stone-200 dark:border-stone-700 transition-colors"
              >
                {dict.download_select_all || "Chọn tất cả"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetDefault}
                className="text-[10px] font-bold px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:text-viet-red rounded-xs border border-stone-200 dark:border-stone-700 transition-colors"
              >
                {dict.download_default || "Mặc định"}
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {FULL_HEADERS.map(({ key, label, dictKey }) => {
              const isChecked = checkedState[key];
              const displayLabel = (dictKey && dict[dictKey]) || label;
              return (
                <motion.label
                  key={key}
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-center gap-2.5 p-2 rounded-xs border cursor-pointer select-none transition-all ${
                    isChecked
                      ? "border-viet-red/40 bg-red-50/50 dark:bg-red-950/20 text-stone-900 dark:text-stone-100 font-semibold"
                      : "border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 text-stone-500 dark:text-stone-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleChange(key)}
                    className="w-3.5 h-3.5 accent-viet-red rounded-xs cursor-pointer"
                  />
                  <span className="text-xs truncate">{displayLabel}</span>
                </motion.label>
              );
            })}
          </div>
        </div>

        {/* Right Column: Download Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
            <h3 className="text-sm font-extrabold uppercase tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="w-2 h-2 bg-viet-red rounded-full"></span>
              {dict.download_formats || "Định dạng tải về"}
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {dict.download_total_artifacts || "Tổng số hiện vật khả dụng"}: {artifacts ? artifacts.length : "..."}
            </p>
          </div>

          {/* CSV File Option */}
          <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            className="p-4 rounded-sm border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 hover:border-viet-red/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100/60 dark:bg-emerald-950/50 px-2 py-0.5 rounded-xs">
                  {dict.download_csv_badge || "Bảng tính & Thống kê"}
                </span>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-2">
                  ham-anh-cac-{maxPublicDate}.csv
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                  {dict.download_csv_desc || "Định dạng CSV chuẩn UTF-8 có BOM, tối ưu cho Excel, Google Sheets, R và Python Pandas."}
                </p>
              </div>
              <span className="text-2xl ml-2">📊</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                handleDownloadData(
                  `ham-anh-cac-${maxPublicDate}.csv`,
                  "text/csv;charset=utf-8",
                )
              }
              className="mt-4 w-full bg-viet-red text-white py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-red-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
              <span>{dict.download_csv_btn || "Tải file .CSV"}</span>
            </motion.button>
          </motion.div>

          {/* TXT / Markdown File Option */}
          <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            className="p-4 rounded-sm border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 hover:border-viet-red/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold bg-sky-100/60 dark:bg-sky-950/50 px-2 py-0.5 rounded-xs">
                  {dict.download_txt_badge || "Văn bản & AI Prompt"}
                </span>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-2">
                  ham-anh-cac-{maxPublicDate}.txt
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                  {dict.download_txt_desc || "Định dạng văn bản thuần, tối ưu để nạp vào Google NotebookLM, Gemini, Claude và ChatGPT."}
                </p>
              </div>
              <span className="text-2xl ml-2">📝</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                handleDownloadData(
                  `ham-anh-cac-${maxPublicDate}.txt`,
                  "text/plain;charset=utf-8",
                )
              }
              className="mt-4 w-full bg-stone-900 dark:bg-stone-700 text-white py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-viet-red dark:hover:bg-viet-red transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
              <span>{dict.download_txt_btn || "Tải file .TXT"}</span>
            </motion.button>
          </motion.div>

          {/* Success Download Notification */}
          <AnimatePresence>
            {downloadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs rounded-sm flex items-center gap-2"
              >
                <span className="text-base">✓</span>
                <span>
                  {dict.download_success_prefix || "Đã tạo và tải xuống"} <strong>{downloadSuccess}</strong> {dict.download_success_suffix || "thành công!"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
