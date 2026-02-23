"use client";

import type { Artifact } from "@/contexts/artifact";

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;
const SHEET_NAME = process.env.NEXT_PUBLIC_SHEET_NAME;
const SHEET_RANGE = process.env.NEXT_PUBLIC_SHEET_RANGE;

function parseCSV(text: string): Artifact[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;
  const cleanText = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      currentRow.push(currentField);
      if (currentRow.length > 0) rows.push(currentRow);
      currentRow = [];
      currentField = "";
    } else currentField += char;
  }
  if (currentField !== "" || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  const results: Artifact[] = [];
  for (let i = 1; i < rows.length; i++) {
    const data = rows[i];
    if (data.length < headers.length) continue;
    const artifact: any = {};
    headers.forEach((header, index) => {
      const value = (data[index] || "").trim();
      if (header === "categories") {
        artifact[header] = value
          .split(/[\s,]+/)
          .filter(Boolean)
          .map((v) => v.trim());
      } else if (header === "supporting_images" || header === "sources") {
        if (value.includes("<iframe")) artifact[header] = [value];
        else
          artifact[header] = value
            .split(/[ \n;,]+/)
            .map((v) => v.trim())
            .filter(Boolean);
      } else artifact[header] = value;
    });
    if (!artifact.id) artifact.id = String(i);
    results.push(artifact as Artifact);
  }
  return results;
}

export async function fetchArtifacts() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}&range=${SHEET_RANGE}`;
    // console.log(url);
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetch failed");
    const text = await response.text();
    if (text.includes("<!DOCTYPE html>"))
      throw new Error("Invalid CSV (Access Denied)");

    return parseCSV(text);
  } catch (err: any) {
    // console.log(err);
    return undefined;
  }
}
