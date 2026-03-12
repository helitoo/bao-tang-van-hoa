import Link from "next/link";
import type { Ref } from "@/app/[locale]/references/refs";

export default function refserenceSection({
  label,
  refs,
}: {
  label: React.ReactNode;
  refs: Ref[];
}) {
  if (!refs || refs.length === 0) return null;

  return (
    <div className="mb-12 font-sans text-gray-800">
      {/* Label với đường gạch chân đặc trưng */}
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-bold tracking-widest text-viet-red mr-4">
          {label}
        </h2>
        <div className="flex-1 h-px bg-stone-500"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {refs.map((item, index) => (
          <div
            key={index}
            className="group border-l-2 border-transparent hover:border-viet-red pl-4 transition-all duration-300"
          >
            <h3 className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              {item.name}
            </h3>

            {item.sptName && (
              <h4 className="text-sm font-normal! tracking-tight text-stone-900 dark:text-stone-100">
                {item.sptName}
              </h4>
            )}

            {item.desc && (
              <p className="mt-1 text-sm text-stone-500 leading-relaxed">
                {item.desc}
              </p>
            )}

            {item.url && (
              <Link
                href={item.url}
                target="_blank"
                className="mt-1 text-[10px] text-stone-500 leading-relaxed font-light hover:text-viet-red truncate block max-w-full"
              >
                {item.url}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
