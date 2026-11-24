import type { Metadata } from "next";
import { getLangDict, locales } from "@/lib/lang";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getLangDict(locale);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://btvh.vercel.app";
  const languageAlternates: Record<string, string> = {
    "x-default": `${baseUrl}/vi/download`,
  };
  locales.forEach((l) => {
    languageAlternates[l] = `${baseUrl}/${l}/download`;
  });

  return {
    title: dict.nav_download,
    description: "Tải dữ liệu mở (Open Data) về kho lưu trữ hiện vật văn hóa Việt Nam dưới định dạng CSV hoặc TXT phục vụ nghiên cứu và AI Prompting.",
    alternates: {
      canonical: `${baseUrl}/${locale}/download`,
      languages: languageAlternates,
    },
    openGraph: {
      title: `${dict.nav_download} | ${dict.museum_name}`,
      description: "Tải xuống tập dữ liệu hiện vật văn hóa Việt Nam.",
      url: `${baseUrl}/${locale}/download`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
