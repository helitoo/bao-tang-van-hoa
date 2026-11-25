import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getLangDict, locales } from "@/lib/lang";
import {
  getCollectionByIdServer,
  getCollectionsWithArtifactsServer,
} from "@/lib/serverArtifacts";
import ArtifactCard from "@/components/ArtifactCard";
import { getSourceImgUrl } from "@/lib/imgProcessor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; cid: string }>;
}): Promise<Metadata> {
  const { locale, cid } = await params;
  const [dict, collection] = await Promise.all([
    getLangDict(locale),
    getCollectionByIdServer(cid),
  ]);

  if (!collection) {
    return {
      title: `404 | ${dict.museum_name || "Hàm Anh Các"}`,
      robots: { index: false, follow: true },
    };
  }

  const title = `${collection.name} | ${dict.nav_collection || "Bộ sưu tập"} - ${dict.museum_name || "Hàm Anh Các"}`;
  const description =
    collection.description?.slice(0, 160) ||
    `Bộ sưu tập ${collection.name} gồm ${collection.artifacts.length} hiện vật tại Hàm Anh Các.`;
  const coverImage = collection.coverImage
    ? getSourceImgUrl(collection.coverImage, 1200)
    : undefined;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://btvh.vercel.app";
  const languageAlternates: Record<string, string> = {
    "x-default": `${baseUrl}/vi/collection/${cid}`,
  };
  locales.forEach((l) => {
    languageAlternates[l] = `${baseUrl}/${l}/collection/${cid}`;
  });

  return {
    title,
    description,
    keywords: [
      collection.name,
      "Bộ sưu tập",
      "Di sản Việt Nam",
      "Hàm Anh Các",
      dict.museum_name || "Hàm Anh Các",
    ],
    alternates: {
      canonical: `${baseUrl}/${locale}/collection/${cid}`,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/collection/${cid}`,
      siteName: dict.museum_name,
      images: coverImage
        ? [
            {
              url: coverImage,
              width: 1200,
              height: 630,
              alt: collection.name,
            },
          ]
        : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverImage ? [coverImage] : undefined,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; cid: string }>;
}) {
  const { locale, cid } = await params;
  const [dict, collection] = await Promise.all([
    getLangDict(locale),
    getCollectionByIdServer(cid),
  ]);

  if (!collection) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://btvh.vercel.app";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.nav_home || "Trang chủ",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.nav_collection || "Bộ sưu tập",
        item: `${baseUrl}/${locale}/collection`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: collection.name,
        item: `${baseUrl}/${locale}/collection/${cid}`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description || `Bộ sưu tập ${collection.name}`,
    url: `${baseUrl}/${locale}/collection/${cid}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collection.artifacts.length,
      itemListElement: collection.artifacts.map((a, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/${locale}/artifact/${a.id}`,
        name: a.name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-16 min-h-[calc(100vh-5rem)]">
        {/* Navigation Breadcrumbs */}
        <div className="flex flex-col items-center mb-10 text-center">
          <nav className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-4">
            <Link
              href={`/${locale}/`}
              hrefLang={locale}
              className="hover:text-viet-red transition-colors"
            >
              {dict.nav_home}
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/collection`}
              hrefLang={locale}
              className="hover:text-viet-red transition-colors"
            >
              {dict.nav_collection || "Bộ sưu tập"}
            </Link>
            <span>/</span>
            <span className="text-viet-red truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {collection.name}
            </span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mb-4 max-w-4xl">
            {collection.name}
          </h1>
          <div className="h-1 w-24 bg-viet-red shadow-lg mb-6"></div>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-viet-red px-3 py-1 rounded-full shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.65 7.65a2 2 0 0 1 2.629-1.046l5.51 2.374a2 2 0 0 1 1.046 2.628l-3.957 9.184a2 2 0 0 1-2.628 1.046l-5.51-2.374a2 2 0 0 1-1.046-2.628z" />
                <path d="M18 7.777V4a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v10a2 2 0 0 0 1.137 1.805" />
                <path d="m8 4.389-4.364.809a2 2 0 0 0-1.602 2.33l1.822 9.833a2 2 0 0 0 2.331 1.602l2.542-.47" />
              </svg>
              <span>
                {collection.artifacts.length} {dict.artifacts || "hiện vật"}
              </span>
            </span>
          </div>

          {collection.description && (
            <p className="text-stone-600 dark:text-stone-300 text-sm max-w-3xl leading-relaxed whitespace-pre-line text-justify md:text-center mt-2">
              {collection.description}
            </p>
          )}
        </div>

        {/* Artifacts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {collection.artifacts.map((artifact) => (
            <div key={artifact.id} className="h-full">
              <ArtifactCard item={artifact} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
