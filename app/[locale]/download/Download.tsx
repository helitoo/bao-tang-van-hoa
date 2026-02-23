"use client";

import { useState, useEffect } from "react";

import { useArtifact } from "@/contexts/artifact";
import { Locale } from "@/lib/lang";
import { CATEGORY_GROUPS } from "@/lib/consts/categories";

const fullHeaders: { key: string; label: string }[] = [
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

export default function Download({ locale }: { locale: Locale }) {
  // Load artifacts
  const { artifacts } = useArtifact();

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
      id: (a: any) => a.id,
      name: (a: any) => a.name,
      short_description: (a: any) => a.short_description,
      description: (a: any) => a.description,
      categories: (a: any) => getCatNames(a.categories),
      main_image: (a: any) => a.main_image,
      supporting_images: (a: any) => (a.supporting_images || []).join("; "),
      author: (a: any) => a.author,
      contributor: (a: any) => a.contributor,
      artifact_date: (a: any) => a.artifact_date,
      public_date: (a: any) => a.public_date,
      location: (a: any) => a.location,
    };

    // Get selected cols
    const selectedHeaders = fullHeaders.filter(({ key }) => checkedState[key]);

    // Create rows with selected cols
    const rows = artifacts.map((a) =>
      selectedHeaders.map(({ key }) => {
        const typedKey = key as keyof typeof fieldMap;
        return escapeCSV(fieldMap[typedKey](a) ?? "");
      }),
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
