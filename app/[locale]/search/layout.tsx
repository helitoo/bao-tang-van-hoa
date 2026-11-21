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
    languageAlternates[l] = `https://btvh.vercel.app/${l}/search`;
  });

  return {
    title: dict.nav_search,
    description: "Kho lưu trữ và tra cứu số hóa hiện vật văn hóa, lịch sử và cổ vật Việt Nam theo danh mục, niên đại và màu sắc.",
    alternates: {
      canonical: `https://btvh.vercel.app/${locale}/search`,
      languages: languageAlternates,
    },
    openGraph: {
      title: `${dict.nav_search} | ${dict.museum_name}`,
      description: "Tra cứu hiện vật văn hóa và di sản Việt Nam.",
      url: `https://btvh.vercel.app/${locale}/search`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
