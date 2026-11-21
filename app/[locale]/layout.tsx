import "../globals.css";
import { Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { locales, getLangDict, Locale } from "@/lib/lang";

import { ThemeProvider } from "@/contexts/theme";
import { ArtifactProvider } from "@/contexts/artifact";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RandomArtifactButton from "@/components/RandomArtifactButton";

// Font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "500", "700", "800"],
  style: ["normal", "italic"],
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

  const languageAlternates: Record<string, string> = {
    "x-default": "https://btvh.vercel.app/vi",
  };
  locales.forEach((l) => {
    languageAlternates[l] = `https://btvh.vercel.app/${l}`;
  });

  return {
    metadataBase: new URL("https://btvh.vercel.app"),
    title: {
      default: dict.museum_name,
      template: `%s | ${dict.museum_name}`,
    },
    description: dict.footer_desc,
    applicationName: dict.museum_name,
    authors: [{ name: "Bảo tàng Văn hóa Việt Nam" }],
    creator: "Bảo tàng Văn hóa Việt Nam",
    publisher: "Bảo tàng Văn hóa Việt Nam",
    keywords: [
      "Bảo tàng văn hóa Việt Nam",
      "Di sản văn hóa Việt Nam",
      "Cổ vật Việt Nam",
      "Kho lưu trữ di sản số",
      "Lịch sử Việt Nam",
      "Bảo vật quốc gia",
    ],
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
      canonical: `https://btvh.vercel.app/${locale}`,
      languages: languageAlternates,
    },
    openGraph: {
      title: dict.museum_name,
      description: dict.footer_desc,
      url: `https://btvh.vercel.app/${locale}`,
      siteName: dict.museum_name,
      locale: locale === "vi" ? "vi_VN" : locale,
      type: "website",
      images: [
        {
          url: "https://btvh.vercel.app/background.webp",
          width: 1200,
          height: 630,
          alt: dict.museum_name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.museum_name,
      description: dict.footer_desc,
      images: ["https://btvh.vercel.app/background.webp"],
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

  const dict = await getLangDict(locale);

  // Dynamic Schemas
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dict.museum_name,
    url: `https://btvh.vercel.app/${locale}`,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `https://btvh.vercel.app/${locale}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const museumSchema = {
    "@context": "https://schema.org",
    "@type": "Museum",
    name: dict.museum_name,
    alternateName: dict.museum_sub,
    url: `https://btvh.vercel.app/${locale}`,
    logo: "https://btvh.vercel.app/icon.png",
    image: "https://btvh.vercel.app/background.webp",
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
          <Navbar locale={locale} dict={dict} />
          <ArtifactProvider>
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
