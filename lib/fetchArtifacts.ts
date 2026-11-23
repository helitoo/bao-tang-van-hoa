import type { Artifact } from "@/contexts/artifact";
import { parseCSV } from "@/lib/serverArtifacts";

const SPREADSHEET_ID =
  process.env.NEXT_PUBLIC_SPREADSHEET_ID ||
  "1Rp7NRTGNRG69WDXLonCEiAEppqJcHg3WkmE2xd3nFVQ";
const SHEET_NAME = process.env.NEXT_PUBLIC_SHEET_NAME || "storage";
const rawRange = process.env.NEXT_PUBLIC_SHEET_RANGE || "A1:Z";
const SHEET_RANGE = rawRange.endsWith(":M")
  ? rawRange.replace(/:M$/i, ":Z")
  : rawRange;

export { parseCSV };

export async function fetchArtifacts(): Promise<Artifact[] | undefined> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}&range=${SHEET_RANGE}&headers=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetch failed");
    const text = await response.text();
    if (text.includes("<!DOCTYPE html>"))
      throw new Error("Invalid CSV (Access Denied)");

    return parseCSV(text);
  } catch (err: any) {
    return undefined;
  }
}
