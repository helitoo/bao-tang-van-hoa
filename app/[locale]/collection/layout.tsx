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
    "x-default": `${baseUrl}/vi/collection`,
  };
  locales.forEach((l) => {
    languageAlternates[l] = `${baseUrl}/${l}/collection`;
  });

  const title = `${dict.nav_collection || "Bộ sưu tập"} | ${dict.museum_name || "Hàm Anh Các"}`;
  const description =
    dict.collection_page_desc ||
    "Khám phá các bộ sưu tập chuyên đề về di sản, mỹ thuật, tài liệu cổ và văn hóa Việt Nam tại Hàm Anh Các.";

  return {
    title,
    description,
    keywords: [
      "Bộ sưu tập",
      "Collections",
      "Di sản Việt Nam",
      "Hàm Anh Các",
      "Cổ vật",
      "Tranh dân gian",
      "Triều Nguyễn",
    ],
    alternates: {
      canonical: `${baseUrl}/${locale}/collection`,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/collection`,
      siteName: dict.museum_name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
