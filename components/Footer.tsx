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
      // className={`bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 transition-colors duration-300 p-5 px-2`}
      className="p-10 pt-20 bg-repeat-x bg-[length:auto_100%] bg-[url('/tile.svg')] flex items-center justify-center"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Logo className="size-7 sm:size-10 text-stone-50 text-shadow-sm" />
        {/* Slogan */}
        <div className="flex flex-col">
          {/* Name */}
          <span className="text-[10px] sm:text-lg font-extrabold leading-none text-stone-50 transition-colors uppercase tracking-tight text-shadow-sm">
            {t("museum_name")}
          </span>
          {/* Slogan */}
          <span className="text-[6px] sm:text-[9px] text-stone-50 font-light tracking-widest uppercase text-shadow-sm">
            {t("footer_desc")}
          </span>
          {/* Suporting button */}
          <div className="flex flex-col md:flex-row justify-evenly gap-0.5 mt-2">
            <button className="w-auto text-[6px] sm:text-[9px] bg-viet-red text-white px-1 py-0.5 transition-transform duration-300 hover:-translate-y-1">
              <a href="https://forms.gle/dmjtuKRCcX9WN9h8A" target="_blank">
                {t("nav_contribute")}
              </a>
            </button>

            <button className="w-auto text-[6px] sm:text-[9px] bg-viet-red text-white px-1 py-0.5 transition-transform duration-300 hover:-translate-y-1">
              <a
                href="mailto:bao162006@gmail.com?subject=%5BBTVH%5D%20B%C3%81O%20C%C3%81O%20N%E1%BB%98I%20DUNG"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("nav_report")}
              </a>
            </button>

            <div className="w-auto text-[6px] sm:text-[9px] text-viet-red px-1 py-0.5">
              Admin: bao162006@gmail.com
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
