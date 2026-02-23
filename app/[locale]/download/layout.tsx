import type { Metadata } from "next";
import { getLangDict } from "@/lib/lang";

// Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const dict = await getLangDict(locale);

  return {
    title: dict.nav_download,
  };
}

// Root layout component
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
