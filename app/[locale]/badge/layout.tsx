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
    languageAlternates[l] = `https://btvh.vercel.app/${l}/badge`;
  });

  return {
    title: dict.nav_badge,
    description: "Hệ thống huy hiệu văn hóa và chứng nhận thành tích khám phá các bảo vật, di sản văn hóa Việt Nam.",
    alternates: {
      canonical: `https://btvh.vercel.app/${locale}/badge`,
      languages: languageAlternates,
    },
    openGraph: {
      title: `${dict.nav_badge} | ${dict.museum_name}`,
      description: "Hệ thống huy hiệu khám phá di sản văn hóa.",
      url: `https://btvh.vercel.app/${locale}/badge`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
