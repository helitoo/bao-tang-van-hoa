"use client";

import { useState, useEffect } from "react";

import { useArtifact } from "@/contexts/artifact";
import { Locale } from "@/lib/lang";
import { FULL_HEADERS } from "@/lib/exportData/dataMetadata";

import { getCsvContent } from "@/lib/exportData/getCsvContent";
import { getTxtContent } from "@/lib/exportData/getTxtContent";

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

const DownloadIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-download-icon lucide-download"
    >
      <path d="M12 15V3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
};

export default function Download() {
  // Load artifacts
  const { artifacts } = useArtifact();

  // Checker handle
  const [checkedState, setCheckedState] = useState(
    FULL_HEADERS.reduce(
      (acc, { key }) => {
        acc[key] = defaultCheckedHeaders.includes(key);
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  const handleChange = (header: string) => {
    setCheckedState((prev) => ({
      ...prev,
      [header]: !prev[header],
    }));
  };

  // Find max artfact public day

  const [maxPublicDate, setMaxPublicDate] = useState<string | undefined>();

  useEffect(() => {
    if (!artifacts) return;
    setMaxPublicDate(
      artifacts[0].public_date.replaceAll("/", "-") || undefined,
    );
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
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mt-5 md:px-10">
      {/* Header checker */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-left justify-items-start">
        {FULL_HEADERS.map(({ key, label }) => (
          <label key={key} style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={checkedState[key]}
              onChange={() => handleChange(key)}
            />{" "}
            {label}
          </label>
        ))}
      </div>

      {/* Download */}
      <ol className={`mt-5 md:mt-0 ${!artifacts && "skeleton h-20 rounded"}`}>
        {artifacts && (
          <>
            <li
              className="flex justify-between hover:text-viet-red hover:bg-stone-500/25 p-1 px-2 cursor-pointer"
              onClick={() =>
                handleDownloadData(
                  `btvh-${maxPublicDate}.csv`,
                  "text/csv;charset=utf-8",
                )
              }
            >
              <span>{`[latest] btvh-${maxPublicDate}.csv`}</span>{" "}
              <DownloadIcon />{" "}
            </li>
            <li
              className="flex justify-between hover:text-viet-red hover:bg-stone-500/25 p-1 px-2 cursor-pointer"
              onClick={() =>
                handleDownloadData(
                  `btvh-${maxPublicDate}.txt`,
                  "text/plain;charset=utf-8",
                )
              }
            >
              <span>{`[latest] btvh-${maxPublicDate}.txt`}</span>{" "}
              <DownloadIcon />{" "}
            </li>
          </>
        )}
      </ol>
    </div>
  );
}
