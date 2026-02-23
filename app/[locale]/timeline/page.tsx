import Link from "next/link";

import { getLangDict, Locale } from "@/lib/lang";
import Timeline from "@/app/[locale]/timeline/Timeline";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getLangDict(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-5rem)] flex flex-col relative">
      <div className="text-center mb-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <nav className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-4">
            <Link
              href={`${locale}/`}
              className="hover:text-viet-red transition-colors"
            >
              {dict.nav_home}
            </Link>
            <span>/</span>
            <span className="text-viet-red">{dict.nav_timeline}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-tight mb-4">
            {dict.timeline_title}
          </h1>
          <div className="h-1 w-24 bg-viet-red shadow-lg mb-6"></div>
        </div>
      </div>

      <Timeline locale={locale as Locale} dict={dict} />

      <style>{`
        .always-show-scrollbar { overflow-x: scroll !important; }
        .custom-scrollbar-h::-webkit-scrollbar { height: 10px; }
        .custom-scrollbar-h::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 5px; }
        .dark .custom-scrollbar-h::-webkit-scrollbar-track { background: #1c1917; }
        .custom-scrollbar-h::-webkit-scrollbar-thumb { background: #b91c1c; border-radius: 5px; border: 2px solid #f1f1f1; }
        .dark .custom-scrollbar-h::-webkit-scrollbar-thumb { border-color: #1c1917; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 14px; width: 14px; border-radius: 50%;
          background: #b91c1c; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
