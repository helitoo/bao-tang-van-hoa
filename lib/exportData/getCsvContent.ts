import type { Artifact } from "@/contexts/artifact";
import { FIELD_CONTENT_MAP } from "@/lib/exportData/dataMetadata";

const escapeCSV = (val: any) => {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  str = str.replace(/"/g, '""');
  return `"${str}"`;
};

export function getCsvContent(
  artifacts: Artifact[],
  selectedHeaders: { key: string; label: string }[],
) {
  // Create rows with selected cols
  const rows = artifacts.map((a) =>
    selectedHeaders.map(({ key }) => {
      const typedKey = key as keyof typeof FIELD_CONTENT_MAP;
      return escapeCSV(FIELD_CONTENT_MAP[typedKey](a) ?? "");
    }),
  );

  const content = [
    selectedHeaders.map((h) => escapeCSV(h.label)).join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  return content;
}
