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
  variable: "--font-montserrat", // dùng cho Tailwind
  display: "swap",
});

// Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const dict = await getLangDict(locale);

  return {
    title: {
      default: dict.museum_name,
      template: `%s | ${dict.museum_name}`,
    },
    description: dict.footer_desc,
    openGraph: {
      title: dict.museum_name,
      description: dict.footer_desc,
    },
  };
}

// Schemas

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Museum of Vietnamese Culture",
  url: "https://btvh.vercel.app/vi/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://btvh.vercel.app/vi/search?query={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NonProfit",
  name: "Museum of Vietnamese Culture",
  url: "https://btvh.vercel.app/vi/",
  logo: "https://btvh.vercel.app/vi/logo.png",
  // sameAs: [
  //   "https://facebook.com/yourcommunity",
  //   "https://github.com/yourcommunity"
  // ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "community support",
    email: "bao162006@gmail.com",
  },
};

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

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={montserrat.variable}>
        <ThemeProvider>
          <Navbar locale={locale} dict={dict} />
          <ArtifactProvider>
            {children}
            <RandomArtifactButton locale={locale as Locale} />

            {/* Schemas */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(websiteSchema),
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(organizationSchema),
              }}
            />
          </ArtifactProvider>
          <Footer dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  );
}
