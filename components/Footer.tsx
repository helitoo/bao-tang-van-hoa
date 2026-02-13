import React from "react";
import { useLanguage } from "../App";

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 5 5" className={className} fill="currentColor">
    <path d="M1 0h1v1h-1z M3 0h1v1h-1z" />
    <path d="M0 1h5v1h-5z" />
    <path d="M1 2h3v1h-3z" />
    <path d="M1 3h1v1h-1z M3 3h1v1h-1z" />
    <path d="M1 4h1v1h-1z M3 4h1v1h-1z" />
  </svg>
);

interface FooterProps {
  isSidebar?: boolean;
}

const Footer: React.FC<FooterProps> = () => {
  const { t } = useLanguage();
  return (
    <footer
      className={`bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 transition-colors duration-300 p-5 px-2`}
    >
      <div className="flex justify-evenly gap-5">
        {/* Logo and slogan */}
        <div>
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <Logo className="w-10 h-10 text-viet-red" />
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-extrabold leading-none text-stone-900 dark:text-stone-100 group-hover:text-viet-red transition-colors uppercase tracking-tight">
                {t("museum_name")}
              </span>
              <span className="text-[9px] text-stone-500 dark:text-stone-400 font-extralight tracking-widest uppercase mt-0.5">
                {t("footer_desc")}
              </span>
            </div>
          </div>
        </div>

        {/* Rights */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2">
            {t("footer_support")}
          </h4>
          <ul className="space-y-2 text-sm text-stone-500 dark:text-stone-400 font-medium">
            <li className="hover:text-viet-red transition-colors cursor-pointer">
              {t("footer_report")}
            </li>
            <li className="text-[10px] opacity-70 mt-4 leading-relaxed font-extralight">
              © {new Date().getFullYear()} {t("museum_name")}. <br />
              All rights reserved.
            </li>
          </ul>
        </div>
        {/*  */}
      </div>
    </footer>
  );
};

export default Footer;
