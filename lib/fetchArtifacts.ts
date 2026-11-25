import type { Artifact, Collection } from "@/contexts/artifact";
import { parseCSV, parseCollectionsCSV } from "@/lib/serverArtifacts";

const SPREADSHEET_ID =
  process.env.NEXT_PUBLIC_SPREADSHEET_ID ||
  "1Rp7NRTGNRG69WDXLonCEiAEppqJcHg3WkmE2xd3nFVQ";
const SHEET_NAME = process.env.NEXT_PUBLIC_SHEET_NAME || "storage";
const rawRange = process.env.NEXT_PUBLIC_SHEET_RANGE || "A1:Z";
const SHEET_RANGE = rawRange.endsWith(":M")
  ? rawRange.replace(/:M$/i, ":Z")
  : rawRange;

export { parseCSV, parseCollectionsCSV };

export async function fetchArtifacts(): Promise<Artifact[] | undefined> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}&range=${SHEET_RANGE}&headers=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetch failed");
    const text = await response.text();
    if (text.includes("<!DOCTYPE html>"))
      throw new Error("Invalid CSV (Access Denied)");

    const parsed = parseCSV(text);
    return parsed.filter(
      (item) =>
        Boolean(item.id && String(item.id).trim()) &&
        Boolean(item.name && String(item.name).trim()) &&
        Boolean(
          (item.main_image && String(item.main_image).trim()) ||
            ((item as any)["main image"] &&
              String((item as any)["main image"]).trim()),
        ),
    );
  } catch (err: any) {
    return undefined;
  }
}

export async function fetchCollections(): Promise<Collection[] | undefined> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=collections&range=A1:C&headers=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetch failed");
    const text = await response.text();
    if (text.includes("<!DOCTYPE html>"))
      throw new Error("Invalid CSV (Access Denied)");

    return parseCollectionsCSV(text);
  } catch (err: any) {
    return undefined;
  }
}
