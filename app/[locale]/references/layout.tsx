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
    "x-default": `${baseUrl}/vi/references`,
  };
  locales.forEach((l) => {
    languageAlternates[l] = `${baseUrl}/${l}/references`;
  });

  return {
    title: dict.nav_references,
    description: "Thư viện tư liệu số, cổ thư, điển tịch, hệ thống bảo tàng và cộng đồng nghiên cứu cổ phong di sản văn hóa Việt Nam.",
    alternates: {
      canonical: `${baseUrl}/${locale}/references`,
      languages: languageAlternates,
    },
    openGraph: {
      title: `${dict.nav_references} | ${dict.museum_name}`,
      description: "Thư viện tư liệu, cổ thư và tài liệu tham khảo di sản.",
      url: `${baseUrl}/${locale}/references`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
