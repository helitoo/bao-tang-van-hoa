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
      className={`pt-10 pb-5 px-2 bg-repeat-x bg-[length:auto_100%] bg-[url('/tile.svg')]`}
    >
      <div className="flex justify-center items-center gap-5">
        {/* Logo and slogan */}
        <div>
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Logo className="w-10 h-10 text-stone-50 text-shadow-sm" />
            {/* Slogan */}
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-extrabold leading-none text-stone-50 transition-colors uppercase tracking-tight text-shadow-sm">
                {t("museum_name")}
              </span>
              <span className="text-[9px] text-stone-50 font-light tracking-widest uppercase mt-0.5 text-shadow-sm">
                {t("footer_desc")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
