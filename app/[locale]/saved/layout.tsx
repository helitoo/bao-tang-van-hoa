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
    title: dict.nav_saved,
    description: "Danh sách hiện vật đã lưu trong bộ sưu tập cá nhân",
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
