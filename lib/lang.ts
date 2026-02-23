export const locales = ["en", "vi", "zh", "ja", "ko"];

export type Locale = "vi" | "en" | "zh" | "ja" | "ko";

export const langLabels: { code: Locale; label: string; fullName: string }[] = [
  { code: "vi", label: "VN", fullName: "Tiếng Việt" },
  { code: "en", label: "EN", fullName: "English" },
  { code: "zh", label: "中", fullName: "中文" },
  { code: "ja", label: "日", fullName: "日本語" },
  { code: "ko", label: "한", fullName: "한국어" },
];

// lib/lang.ts

const dictionaries = {
  vi: () => import("@/lib/messages/vi.json"),
  en: () => import("@/lib/messages/en.json"),
  zh: () => import("@/lib/messages/zh.json"),
  ja: () => import("@/lib/messages/ja.json"),
  ko: () => import("@/lib/messages/ko.json"),
};

export async function getLangDict(locale: string) {
  if (!locales.includes(locale)) locale = "vi";
  return dictionaries[locale as Locale]().then((m) => m.default);
}
