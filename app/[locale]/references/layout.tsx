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
    languageAlternates[l] = `https://btvh.vercel.app/${l}/references`;
  });

  return {
    title: dict.nav_references,
    description: "Thư viện tư liệu số, cổ thư, điển tịch, hệ thống bảo tàng và cộng đồng nghiên cứu cổ phong di sản văn hóa Việt Nam.",
    alternates: {
      canonical: `https://btvh.vercel.app/${locale}/references`,
      languages: languageAlternates,
    },
    openGraph: {
      title: `${dict.nav_references} | ${dict.museum_name}`,
      description: "Thư viện tư liệu, cổ thư và tài liệu tham khảo di sản.",
      url: `https://btvh.vercel.app/${locale}/references`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
