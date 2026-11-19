import type { Metadata } from "next";
import { getLangDict } from "@/lib/lang";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getLangDict(locale);

  return {
    title: `${dict.nav_map || "Bản đồ"} | ${dict.museum_name || "Bảo tàng Văn hóa Việt Nam"}`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
