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
    languageAlternates[l] = `https://btvh.vercel.app/${l}/download`;
  });

  return {
    title: dict.nav_download,
    description: "Tải dữ liệu mở (Open Data) về kho lưu trữ hiện vật văn hóa Việt Nam dưới định dạng CSV hoặc TXT phục vụ nghiên cứu và AI Prompting.",
    alternates: {
      canonical: `https://btvh.vercel.app/${locale}/download`,
      languages: languageAlternates,
    },
    openGraph: {
      title: `${dict.nav_download} | ${dict.museum_name}`,
      description: "Tải xuống tập dữ liệu hiện vật văn hóa Việt Nam.",
      url: `https://btvh.vercel.app/${locale}/download`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
