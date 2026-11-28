import { getLangDict } from "@/lib/lang";
import { getMapArtifactsServer } from "@/lib/serverArtifacts";
import MapPageClient from "./MapPageClient";

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Only architecture items with coordinates, trimmed to the marker fields
  const [dict, artifacts] = await Promise.all([
    getLangDict(locale),
    getMapArtifactsServer(),
  ]);

  return <MapPageClient locale={locale} dict={dict} artifacts={artifacts} />;
}
