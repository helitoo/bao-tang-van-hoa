import Link from "next/link";
import { getLangDict } from "@/lib/lang";
import { getCollectionsWithArtifactsServer } from "@/lib/serverArtifacts";
import CollectionClient from "@/app/[locale]/collection/CollectionClient";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [dict, collections] = await Promise.all([
    getLangDict(locale),
    getCollectionsWithArtifactsServer(),
  ]);

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
    ],
  };

  const collectionListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${dict.nav_collection || "Bộ sưu tập"} | ${dict.museum_name || "Hàm Anh Các"}`,
    description: "Danh sách các bộ sưu tập di sản và hiện vật văn hóa Việt Nam.",
    url: `${baseUrl}/${locale}/collection`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collections.length,
      itemListElement: collections.map((col, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/${locale}/collection/${col.id}`,
        name: col.name,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionListSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-16 min-h-[calc(100vh-5rem)]">
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
            <span className="text-viet-red">{dict.nav_collection || "Bộ sưu tập"}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-tight mb-4">
            {dict.nav_collection || "Bộ sưu tập"}
          </h1>
          <div className="h-1 w-24 bg-viet-red shadow-lg mb-6"></div>
          <p className="text-stone-600 dark:text-stone-300 text-sm max-w-2xl leading-relaxed text-justify md:text-center">
            {dict.collection_desc ||
              "Khám phá các chuyên đề di sản văn hóa, tư liệu lịch sử và tác phẩm nghệ thuật Việt Nam được chọn lọc và hệ thống hóa."}
          </p>
        </div>

        <CollectionClient
          initialCollections={collections}
          locale={locale}
          dict={dict}
        />
      </div>
    </>
  );
}
