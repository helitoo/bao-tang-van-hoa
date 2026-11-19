import { getLangDict } from "@/lib/lang";
import MapPageClient from "./MapPageClient";

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getLangDict(locale);

  return <MapPageClient locale={locale} dict={dict} />;
}
