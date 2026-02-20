import React, { useState } from "react";
import { useLanguage } from "../App";
// Fix: Use namespace import for react-router-dom to resolve export issues
import * as ReactRouterDOM from "react-router-dom";
const { Link } = ReactRouterDOM;
import { Artifact } from "../types";
import { CATEGORY_GROUPS } from "../constants";

interface Props {
  artifacts: Artifact[];
}

const fullHeaders = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "short_description", label: "Short Description" },
  { key: "description", label: "Description" },
  { key: "categories", label: "Categories" },
  { key: "main_image", label: "Main Image URL" },
  { key: "supporting_images", label: "Supporting Images" },
  { key: "author", label: "Author" },
  { key: "contributor", label: "Contributor" },
  { key: "artifact_date", label: "Artifact Era" },
  { key: "public_date", label: "Public Date" },
  { key: "location", label: "Location" },
];

const defaultCheckedHeaders = [
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
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-download-icon lucide-download"
    >
      <path d="M12 15V3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
};

const Download: React.FC<Props> = ({ artifacts }) => {
  const { t, locale } = useLanguage();

  // Checker handle

  const [checkedState, setCheckedState] = useState(
    fullHeaders.reduce(
      (acc, { key }) => {
        acc[key] = defaultCheckedHeaders.includes(key);
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  const handleChange = (header) => {
    setCheckedState((prev) => ({
      ...prev,
      [header]: !prev[header],
    }));
  };

  // Find max artfact public day
  const [maxPublicDate, setMaxPublicDate] = useState(
    artifacts[0].public_date.replaceAll("/", "-") || null,
  );

  const handleDownloadData = (
    fileName: string,
    fileType: "text/csv;charset=utf-8" | "text/plain;charset=utf-8",
  ) => {
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

    const fieldMap = {
      id: (a) => a.id,
      name: (a) => a.name,
      short_description: (a) => a.short_description,
      description: (a) => a.description,
      categories: (a) => getCatNames(a.categories),
      main_image: (a) => a.main_image,
      supporting_images: (a) => (a.supporting_images || []).join("; "),
      author: (a) => a.author,
      contributor: (a) => a.contributor,
      artifact_date: (a) => a.artifact_date,
      public_date: (a) => a.public_date,
      location: (a) => a.location,
    };

    // Get selected cols
    const selectedHeaders = fullHeaders.filter(({ key }) => checkedState[key]);

    // Create rows with selected cols
    const rows = artifacts.map((a) =>
      selectedHeaders.map(({ key }) => escapeCSV(fieldMap[key]?.(a) ?? "")),
    );

    const csvContent = [
      selectedHeaders.map((h) => escapeCSV(h.label)).join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
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
    <div className="max-w-5xl mx-auto px-4 py-16 min-h-[calc(100vh-5rem)]">
      <div className="flex flex-col items-center mb-16 text-center">
        <nav className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-4">
          <Link to="/" className="hover:text-viet-red transition-colors">
            {t("nav_home")}
          </Link>
          <span>/</span>
          <span className="text-viet-red">{t("nav_download")}</span>
        </nav>
        <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-tight mb-4">
          {t("nav_download")}
        </h1>
        <div className="h-1 w-24 bg-viet-red shadow-lg mb-6"></div>
        <div className="relative">
          <p className="text-justify">{t("download_desc")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-5 md:px-10">
            {/* Header checker */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-left justify-items-start">
              {fullHeaders.map(({ key, label }) => (
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
            <ol className="mt-5 md:mt-0">
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
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Download;
