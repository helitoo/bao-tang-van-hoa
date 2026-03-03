import Link from "next/link";

import type { Locale } from "@/lib/lang";

export default function BadgeSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: any;
}) {
  return (
    <section className="max-w-7xl mx-auto px-2 md:px-4 flex flex-col justify-center items-center">
      <img
        src="/badge/badge-bg.png"
        alt="Badge Background"
        className="mx-auto w-full md:w-2/3 h-auto"
        draggable={false}
      />
      <Link
        href={`/${locale}/badge`}
        className="btn bg-viet-red text-white p-3 rounded-sm transition-all transform inline-block text-sm font-extrabold uppercase tracking-widest"
      >
        {dict.nav_badge}
      </Link>
    </section>
  );
}
