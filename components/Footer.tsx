import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer({ dict }: { dict: any }) {
  return (
    <footer
      // className={`bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 transition-colors duration-300 p-5 px-2`}
      className="w-full p-10 pt-20 bg-repeat-x bg-[length:auto_100%] bg-[url('/tile.svg')] flex items-center justify-center"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Logo className="size-12 sm:size-20 text-stone-50" />
        {/* Slogan */}
        <div className="flex flex-col">
          {/* Name */}
          <span className="text-[10px] sm:text-lg font-extrabold leading-none text-stone-50 transition-colors uppercase tracking-tight">
            {dict.museum_name}
          </span>
          {/* Slogan */}
          <span className="text-[6px] sm:text-[9px] text-stone-50 font-light tracking-widest uppercase">
            {dict.footer_desc}
          </span>
          {/* Suporting button */}
          <div className="flex flex-col md:flex-row justify-evenly gap-0.5 mt-2">
            <button className="btn w-auto text-[6px] sm:text-[9px] bg-viet-red text-white px-1 py-0.5 transition-transform duration-300">
              <Link
                href="mailto:bao162006@gmail.com?subject=%5BBTVH%5D%20B%C3%81O%20C%C3%81O%20N%E1%BB%98I%20DUNG"
                hrefLang="vi"
                target="_blank"
                rel="noopener noreferrer"
              >
                {dict.nav_report}
              </Link>
            </button>

            <div className="w-auto text-[6px] sm:text-[9px] text-viet-red px-1 py-0.5">
              Admin: bao162006@gmail.com
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
