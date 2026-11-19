"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center bg-stone-100 dark:bg-stone-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-viet-red border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-widest">
          Đang tải bản đồ di tích kiến trúc...
        </p>
      </div>
    </div>
  ),
});

export default function MapPageClient({
  locale,
  dict,
}: {
  locale: string;
  dict: any;
}) {
  return <MapComponent locale={locale} dict={dict} />;
}
