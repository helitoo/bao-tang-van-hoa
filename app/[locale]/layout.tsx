import "../globals.css";
import { Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { locales, getLangDict, Locale } from "@/lib/lang";

import { ThemeProvider } from "@/contexts/theme";
import { ArtifactProvider } from "@/contexts/artifact";
import {
  fetchArtifactsServer,
  fetchCollectionsServer,
} from "@/lib/serverArtifacts";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RandomArtifactButton from "@/components/RandomArtifactButton";
import HolidayToast from "@/components/HolidayToast";

// Font
const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
});

// Root Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getLangDict(locale);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://btvh.vercel.app";
  const languageAlternates: Record<string, string> = {
    "x-default": `${baseUrl}/vi`,
  };
  locales.forEach((l) => {
    languageAlternates[l] = `${baseUrl}/${l}`;
  });

  const ogImageMap: Record<string, string> = {
    vi: `${baseUrl}/bgs/og-vi.png`,
    en: `${baseUrl}/bgs/og-en.png`,
    zh: `${baseUrl}/bgs/og-zh.png`,
    ja: `${baseUrl}/bgs/og-ja.png`,
    ko: `${baseUrl}/bgs/og-ko.png`,
    fr: `${baseUrl}/bgs/og-fr.png`,
  };
  const ogImageUrl = ogImageMap[locale] || `${baseUrl}/bgs/og-vi.png`;

  const ogLocaleMap: Record<string, string> = {
    vi: "vi_VN",
    en: "en_US",
    zh: "zh_CN",
    ja: "ja_JP",
    ko: "ko_KR",
    fr: "fr_FR",
  };
  const ogLocale = ogLocaleMap[locale] || "vi_VN";
  const alternateOgLocales = Object.values(ogLocaleMap).filter(
    (l) => l !== ogLocale
  );

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: dict.museum_name,
      template: `%s | ${dict.museum_name}`,
    },
    description: dict.footer_desc,
    applicationName: dict.museum_name,
    authors: [{ name: "Hàm Anh Các" }],
    creator: "Hàm Anh Các",
    publisher: "Hàm Anh Các",
    keywords: [
      "Hàm Anh Các",
      "含英閣",
      "Ham Anh Cac",
      "Di sản văn hóa Việt Nam",
      "Cổ vật Việt Nam",
      "Kho lưu trữ di sản số",
      "Lịch sử Việt Nam",
      "Bảo vật quốc gia",
    ],
    verification: {
      google: "googleebf997dcf426483e",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: languageAlternates,
    },
    openGraph: {
      title: dict.museum_name,
      description: dict.footer_desc,
      url: `${baseUrl}/${locale}`,
      siteName: dict.museum_name,
      locale: ogLocale,
      alternateLocale: alternateOgLocales,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1920,
          height: 1080,
          alt: dict.museum_name,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.museum_name,
      description: dict.footer_desc,
      images: [ogImageUrl],
    },
  };
}

// Root layout component
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  // Artifacts and collections are fetched on the server (cached for 1 hour)
  // and passed to the client provider, so pages render with data right away.
  const [dict, initialArtifacts, initialCollections] = await Promise.all([
    getLangDict(locale),
    fetchArtifactsServer(),
    fetchCollectionsServer(),
  ]);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://btvh.vercel.app";

  // Dynamic Schemas
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dict.museum_name,
    url: `${baseUrl}/${locale}`,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/${locale}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const museumSchema = {
    "@context": "https://schema.org",
    "@type": "Museum",
    name: dict.museum_name,
    alternateName: dict.museum_sub,
    url: `${baseUrl}/${locale}`,
    logo: `${baseUrl}/icon.png`,
    image: `${baseUrl}/bgs/bg.png`,
    description: dict.mission_desc || dict.footer_desc,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "community support",
      email: "bao162006@gmail.com",
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={montserrat.variable}>
        <ThemeProvider>
          <HolidayToast locale={locale as Locale} />
          <Navbar locale={locale} dict={dict} />
          <ArtifactProvider
            initialArtifacts={initialArtifacts}
            initialCollections={initialCollections}
          >
            {children}
            <RandomArtifactButton locale={locale as Locale} />

            {/* Structured Data Schemas */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(websiteSchema),
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(museumSchema),
              }}
            />
          </ArtifactProvider>
          <Footer dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  );
}
