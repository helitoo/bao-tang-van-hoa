"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";

import { langLabels } from "@/lib/lang";

const links = [
  { url: "timeline", labelId: "nav_timeline" },
  { url: "references", labelId: "nav_references" },
  { url: "download", labelId: "nav_download" },
  { url: "badge", labelId: "nav_badge" },
];

export default function Navbar({
  locale,
  dict,
}: {
  locale: string;
  dict: any;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const linkDropdownRef = useRef<HTMLDivElement>(null);

  const currentLang =
    langLabels.find((l) => l.code === locale) || langLabels[0];

  /* Close dropdown when click outside */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }

      if (
        linkDropdownRef.current &&
        !linkDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLinkOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Locale switcher
  function switchLocale(newLocale: string) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <nav className="bg-stone-100 dark:bg-stone-900 border-b-2 border-viet-red sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          title="Home"
          className="flex items-center space-x-3 group shrink-0"
        >
          <Logo className="size-10 text-viet-red" />
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-extrabold leading-none text-viet-red dark:text-stone-100 group-hover:text-viet-red transition-colors uppercase tracking-tight">
              {dict.museum_name}
            </span>
            <span className="text-[9px] text-stone-500 dark:text-stone-400 font-extralight tracking-widest uppercase mt-0.5">
              {dict.museum_sub}
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Search */}
          <Link
            href={`/${locale}/search`}
            hrefLang={locale}
            title={dict.nav_search}
            className={`btn flex items-center justify-center p-2.5 md:px-3 md:py-2 md:space-x-1 rounded-full md:rounded-sm transition-all ${pathname.includes("saved") ? "text-viet-red bg-red-50 md:bg-transparent dark:bg-red-900/10 md:dark:bg-transparent" : "text-stone-500 hover:text-viet-red hover:bg-stone-200 md:hover:bg-transparent dark:hover:bg-stone-800 md:dark:hover:bg-transparent"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill={pathname.includes("search") ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search-icon lucide-search"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            <span className="hidden md:inline text-[10px] font-extrabold uppercase tracking-wider">
              {dict.nav_search}
            </span>
          </Link>

          {/* Contribute */}
          <button
            title={dict.nav_contribute}
            className="btn flex items-center justify-center p-2.5 md:px-3 md:py-2 md:space-x-1 rounded-full md:rounded-sm text-stone-500 hover:text-viet-red hover:bg-stone-200 md:hover:bg-transparent dark:hover:bg-stone-800 md:dark:hover:bg-transparent transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-up-from-line-icon lucide-arrow-up-from-line"
            >
              <path d="m18 9-6-6-6 6" />
              <path d="M12 3v14" />
              <path d="M5 21h14" />
            </svg>
            <Link
              href="https://forms.gle/dmjtuKRCcX9WN9h8A"
              hrefLang="vi"
              target="_blank"
              className="hidden md:inline text-[10px] font-extrabold uppercase tracking-wider"
            >
              {dict.nav_contribute}
            </Link>
          </button>

          {/* Saved */}
          <Link
            href={`/${locale}/saved`}
            hrefLang={locale}
            title={dict.nav_saved}
            className={`btn flex items-center justify-center p-2.5 md:px-3 md:py-2 md:space-x-1 rounded-full md:rounded-sm transition-all ${pathname.includes("saved") ? "text-viet-red bg-red-50 md:bg-transparent dark:bg-red-900/10 md:dark:bg-transparent" : "text-stone-500 hover:text-viet-red hover:bg-stone-200 md:hover:bg-transparent dark:hover:bg-stone-800 md:dark:hover:bg-transparent"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill={pathname.includes("saved") ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bookmark-icon lucide-bookmark"
            >
              <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
            </svg>
            <span className="hidden md:inline text-[10px] font-extrabold uppercase tracking-wider">
              {dict.nav_saved}
            </span>
          </Link>

          <ThemeSwitcher />

          {/* Language dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="btn size-10 rounded-full hover:bg-stone-200/50 flex justify-center items-center text-stone-600 dark:text-stone-300 transition-all hover:text-viet-red!"
              aria-label="Language selector"
            >
              <span className="text-[10px] font-extrabold text-stone-700 dark:text-stone-300 uppercase hover:text-viet-red!">
                {currentLang.label}
              </span>
            </button>

            {isLangOpen && (
              <div className="absolute inline-block min-w-max right-0 mt-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-sm shadow-xl py-1 z-50">
                {langLabels.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLocale(lang.code)}
                    className={`w-full cursor-pointer whitespace-nowrap text-left px-4 py-2 text-xs font-medium hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-viet-red transition-colors flex justify-between items-center ${
                      locale === lang.code
                        ? "text-viet-red font-extrabold"
                        : "text-stone-600 dark:text-stone-300"
                    }`}
                  >
                    {lang.fullName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* More links */}
          <div className="relative" ref={linkDropdownRef}>
            <button
              onClick={() => setIsLinkOpen(!isLinkOpen)}
              className="btn size-10 rounded-full hover:bg-stone-200/50 flex justify-center items-center text-stone-600 dark:text-stone-300 transition-all hover:text-viet-red!"
              aria-label="Webpage selector"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical hover:text-viet-red"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {isLinkOpen && (
              <div className="absolute inline-block min-w-max right-0 mt-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-sm shadow-xl py-1 z-50">
                {links.map((link) => (
                  <Link
                    key={link.url}
                    href={`/${locale}/${link.url}`}
                    hrefLang={locale}
                    className={`whitespace-nowrap text-left px-4 py-2 text-xs font-medium hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-viet-red transition-colors flex justify-between items-center ${pathname.includes(link.url) ? "text-viet-red bg-stone-50 dark:bg-stone-700 font-extrabold" : "text-stone-600 dark:text-stone-300"}`}
                  >
                    {dict[link.labelId]}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
