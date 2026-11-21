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
    languageAlternates[l] = `https://btvh.vercel.app/${l}/map`;
  });

  return {
    title: dict.nav_map,
    description: "Bản đồ số tương tác định vị các công trình kiến trúc cổ, di tích lịch sử và danh lam văn hóa trải dài khắp Việt Nam.",
    alternates: {
      canonical: `https://btvh.vercel.app/${locale}/map`,
      languages: languageAlternates,
    },
    openGraph: {
      title: `${dict.nav_map} | ${dict.museum_name}`,
      description: "Bản đồ tương tác di tích kiến trúc Việt Nam.",
      url: `https://btvh.vercel.app/${locale}/map`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
