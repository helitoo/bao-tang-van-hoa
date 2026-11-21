import type { Metadata } from "next";
import { getLangDict, locales } from "@/lib/lang";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getLangDict(locale);

  const languageAlternates: Record<string, string> = {};
  locales.forEach((l) => {
    languageAlternates[l] = `https://btvh.vercel.app/${l}/timeline`;
  });

  return {
    title: dict.timeline_title || dict.nav_timeline,
    description: "Sơ đồ niên biểu tham quan lịch sử Việt Nam qua các triều đại dựng nước, giữ nước và các mốc thời kỳ lịch sử tiêu biểu.",
    alternates: {
      canonical: `https://btvh.vercel.app/${locale}/timeline`,
      languages: languageAlternates,
    },
    openGraph: {
      title: `${dict.timeline_title || dict.nav_timeline} | ${dict.museum_name}`,
      description: "Sơ đồ niên biểu lịch sử Việt Nam qua các thời kỳ.",
      url: `https://btvh.vercel.app/${locale}/timeline`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
