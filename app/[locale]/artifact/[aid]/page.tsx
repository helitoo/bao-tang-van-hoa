import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type Locale, getLangDict, locales } from "@/lib/lang";
import Artifact from "@/app/[locale]/artifact/[aid]/Artifact";
import {
  getArtifactByIdServer,
  getRelatedArtifactsServer,
} from "@/lib/serverArtifacts";
import { getSourceImgUrl } from "@/lib/imgProcessor";
import { getCategoryName, getCategoryNames } from "@/lib/consts/categories";

// Rendered on first visit, then served from the ISR cache (revalidate is set
// in app/[locale]/layout.tsx). Returning [] keeps the build fast.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; aid: string }>;
}): Promise<Metadata> {
  const { locale, aid } = await params;
  const [dict, artifact] = await Promise.all([
    getLangDict(locale),
    getArtifactByIdServer(aid),
  ]);

  if (!artifact) {
    return {
      title: `${dict.not_found || "Không tìm thấy hiện vật"} | ${dict.museum_name}`,
      robots: { index: false, follow: true },
    };
  }

  const title = `${artifact.name} (${artifact.artifact_date || "Cổ vật di sản"})`;
  const description =
    artifact.short_description ||
    artifact.description?.slice(0, 160) ||
    dict.footer_desc;
  const imageUrl = getSourceImgUrl(artifact.main_image, 1200);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://btvh.vercel.app";
  const languageAlternates: Record<string, string> = {
    "x-default": `${baseUrl}/vi/artifact/${aid}`,
  };
  locales.forEach((l) => {
    languageAlternates[l] = `${baseUrl}/${l}/artifact/${aid}`;
  });

  return {
    title,
    description,
    keywords: [
      artifact.name,
      artifact.artifact_date,
      artifact.location,
      ...(artifact.categories || []).map((id) =>
        getCategoryName(id, locale as Locale),
      ),
      "di sản văn hóa Việt Nam",
      "Hàm Anh Các",
      "Ham Anh Cac",
      "含英閣",
      "cổ vật Việt Nam",
    ].filter(Boolean) as string[],
    alternates: {
      canonical: `${baseUrl}/${locale}/artifact/${aid}`,
      languages: languageAlternates,
    },
    openGraph: {
      title: `${title} | ${dict.museum_name}`,
      description,
      url: `${baseUrl}/${locale}/artifact/${aid}`,
      siteName: dict.museum_name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: artifact.name,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${dict.museum_name}`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; aid: string }>;
}) {
  const { locale, aid } = await params;
  const [dict, artifact] = await Promise.all([
    getLangDict(locale),
    getArtifactByIdServer(aid),
  ]);

  if (!artifact) notFound();
  const related = await getRelatedArtifactsServer(artifact);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://btvh.vercel.app";

  // Schema.org Structured Data: VisualArtwork & BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.nav_home,
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.nav_search,
        item: `${baseUrl}/${locale}/search`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: artifact ? artifact.name : dict.nav_artifact,
        item: `${baseUrl}/${locale}/artifact/${aid}`,
      },
    ],
  };

  const sourceUrls = [
    ...(artifact?.sources || []),
    ...(artifact?.supporting_images || []),
  ].filter((s) => s.startsWith("http://") || s.startsWith("https://"));
  const primarySourceUrl = artifact?.source_url || sourceUrls[0];

  const artworkSchema = artifact
    ? {
        "@context": "https://schema.org",
        "@type": "VisualArtwork",
        name: artifact.name,
        description: artifact.description || artifact.short_description,
        image: getSourceImgUrl(artifact.main_image, 1200),
        dateCreated: artifact.artifact_date,
        creator: {
          "@type": "Person",
          name: artifact.author || "Khuyết danh",
        },
        contentLocation: {
          "@type": "Place",
          name: artifact.location || "Việt Nam",
        },
        genre: getCategoryNames(artifact.categories || [], locale as Locale),
        inLanguage: locale,
        ...(primarySourceUrl ? { isBasedOn: primarySourceUrl } : {}),
        ...(sourceUrls.length > 0 ? { sameAs: sourceUrls } : {}),
      }
    : null;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-6"
        >
          <Link
            href={`/${locale}/`}
            className="hover:text-viet-red transition-colors"
          >
            {dict.nav_home}
          </Link>
          <span>/</span>
          <Link
            href={`/${locale}/search`}
            className="hover:text-viet-red transition-colors"
          >
            {dict.nav_search}
          </Link>
          {artifact && (
            <>
              <span>/</span>
              <span className="text-viet-red truncate max-w-xs sm:max-w-md">
                {artifact.name}
              </span>
            </>
          )}
        </nav>

        <Artifact
          locale={locale as Locale}
          dict={dict}
          aid={aid}
          initialArtifact={artifact}
          related={related}
        />

        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        {artworkSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(artworkSchema),
            }}
          />
        )}
      </div>
    </div>
  );
}
