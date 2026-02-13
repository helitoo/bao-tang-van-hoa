import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
// Fix: Use namespace import for react-router-dom to resolve export issues
import * as ReactRouterDOM from "react-router-dom";
const { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } =
  ReactRouterDOM;
import Home from "./pages/Home";
import Search from "./pages/Search";
import Saved from "./pages/Saved";
import Timeline from "./pages/Timeline";
import ArtifactDetail from "./pages/ArtifactDetail";
import References from "./pages/References";
import Footer from "./components/Footer";
import { Artifact, Locale } from "./types";
import { translations } from "./i18n";

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const SHEET_NAME = import.meta.env.VITE_SHEET_NAME;
const SHEET_RANGE = import.meta.env.VITE_SHEET_RANGE;

type Theme = "light" | "dark" | "system";

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 5 5" className={className} fill="currentColor">
    <path d="M1 0h1v1h-1z M3 0h1v1h-1z" />
    <path d="M0 1h5v1h-5z" />
    <path d="M1 2h3v1h-3z" />
    <path d="M1 3h1v1h-1z M3 3h1v1h-1z" />
    <path d="M1 4h1v1h-1z M3 4h1v1h-1z" />
  </svg>
);

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const icons = {
    light: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-sun-icon lucide-sun"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    ),
    dark: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-moon-icon lucide-moon"
      >
        <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
      </svg>
    ),
    system: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-laptop-icon lucide-laptop"
      >
        <path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z" />
        <path d="M20.054 15.987H3.946" />
      </svg>
    ),
  };
  const nextTheme: Record<Theme, Theme> = {
    light: "dark",
    dark: "system",
    system: "light",
  };
  return (
    <button
      onClick={() => setTheme(nextTheme[theme])}
      className="size-10 rounded-full hover:bg-stone-200/50 flex justify-center items-center text-stone-600 dark:text-stone-300 hover:text-viet-red transition-all"
      aria-label="Switch Theme"
    >
      {icons[theme]}
    </button>
  );
};

const RandomArtifactButton = ({ artifacts }: { artifacts: Artifact[] }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const pickRandom = () => {
    if (!artifacts || artifacts.length === 0) return;
    const randomIndex = Math.floor(Math.random() * artifacts.length);
    const selected = artifacts[randomIndex];
    if (selected && selected.id) {
      navigate(`/artifact/${selected.id}`);
    }
  };
  return (
    <div className="fixed bottom-6 right-6 z-[60] group flex items-center justify-end">
      <div className="mr-3 px-3 py-1.5 bg-stone-900 dark:bg-stone-800 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 pointer-events-none shadow-xl border border-stone-800 dark:border-stone-700 whitespace-nowrap">
        {t("tooltip_random")}
      </div>
      <button
        onClick={pickRandom}
        className="bg-viet-red hover:bg-red-800 text-white p-3 rounded-full transition-transform duration-200 hover:-translate-y-2 active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-dices-icon lucide-dices"
        >
          <rect width="12" height="12" x="2" y="10" rx="2" ry="2" />
          <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" />
          <path d="M6 18h.01" />
          <path d="M10 14h.01" />
          <path d="M15 6h.01" />
          <path d="M18 9h.01" />
        </svg>
      </button>
    </div>
  );
};

const Navbar = () => {
  const { locale, t, setLocale } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const location = useLocation();
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const linkDropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Locale; label: string; fullName: string }[] = [
    { code: "vi", label: "VN", fullName: "Tiếng Việt" },
    { code: "en", label: "EN", fullName: "English" },
    { code: "zh", label: "中", fullName: "中文" },
    { code: "ja", label: "日", fullName: "日本語" },
    { code: "ko", label: "한", fullName: "한국어" },
  ];
  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const links: { url: string; labelId: string }[] = [
    {
      url: "/timeline",
      labelId: "nav_timeline",
    },
    {
      url: "/references",
      labelId: "nav_references",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      )
        setIsLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        linkDropdownRef.current &&
        !linkDropdownRef.current.contains(event.target as Node)
      )
        setIsLinkOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-stone-100 dark:bg-stone-900 border-b-2 border-viet-red sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3 group shrink-0">
          <Logo className="w-10 h-10 text-viet-red" />
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-extrabold leading-none text-stone-900 dark:text-stone-100 group-hover:text-viet-red transition-colors uppercase tracking-tight">
              {t("museum_name")}
            </span>
            <span className="text-[9px] text-stone-500 dark:text-stone-400 font-extralight tracking-widest uppercase mt-0.5">
              {t("museum_sub")}
            </span>
          </div>
        </Link>

        {/* Actions Section */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Search button */}
          <Link
            to="/search"
            title={t("nav_search")}
            className={`flex items-center justify-center p-2.5 md:px-3 md:py-2 md:space-x-1 rounded-full md:rounded-sm transition-all ${location.pathname === "/saved" ? "text-viet-red bg-red-50 md:bg-transparent dark:bg-red-900/10 md:dark:bg-transparent" : "text-stone-500 hover:text-viet-red hover:bg-stone-200 md:hover:bg-transparent dark:hover:bg-stone-800 md:dark:hover:bg-transparent"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill={location.pathname === "/search" ? "currentColor" : "none"}
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-search-icon lucide-search"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            <span className="hidden md:inline text-[10px] font-extrabold uppercase tracking-wider">
              {t("nav_search")}
            </span>
          </Link>

          {/* Contribute */}
          <button
            title={t("nav_contribute")}
            className="flex items-center justify-center p-2.5 md:px-3 md:py-2 md:space-x-1 rounded-full md:rounded-sm text-stone-500 hover:text-viet-red hover:bg-stone-200 md:hover:bg-transparent dark:hover:bg-stone-800 md:dark:hover:bg-transparent transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-up-from-line-icon lucide-arrow-up-from-line"
            >
              <path d="m18 9-6-6-6 6" />
              <path d="M12 3v14" />
              <path d="M5 21h14" />
            </svg>
            <span className="hidden md:inline text-[10px] font-extrabold uppercase tracking-wider">
              {t("nav_contribute")}
            </span>
          </button>

          {/* Save button*/}
          <Link
            to="/saved"
            title={t("nav_saved")}
            className={`flex items-center justify-center p-2.5 md:px-3 md:py-2 md:space-x-1 rounded-full md:rounded-sm transition-all ${location.pathname === "/saved" ? "text-viet-red bg-red-50 md:bg-transparent dark:bg-red-900/10 md:dark:bg-transparent" : "text-stone-500 hover:text-viet-red hover:bg-stone-200 md:hover:bg-transparent dark:hover:bg-stone-800 md:dark:hover:bg-transparent"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill={location.pathname === "/saved" ? "currentColor" : "none"}
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-bookmark-icon lucide-bookmark"
            >
              <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
            </svg>
            <span className="hidden md:inline text-[10px] font-extrabold uppercase tracking-wider">
              {t("nav_saved")}
            </span>
          </Link>

          {/* ThemeSwitcher*/}
          <ThemeSwitcher />

          {/* Language dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="size-10 rounded-full hover:bg-stone-200/50 flex justify-center items-center text-stone-600 dark:text-stone-300 transition-all hover:text-viet-red!"
            >
              <span className="text-[10px] font-extrabold text-stone-700 dark:text-stone-300 uppercase hover:text-viet-red!">
                {currentLang.label}
              </span>
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-sm shadow-xl py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-viet-red transition-colors flex justify-between items-center ${locale === lang.code ? "text-viet-red bg-stone-50 dark:bg-stone-700 font-extrabold" : "text-stone-600 dark:text-stone-300"}`}
                  >
                    <span>{lang.fullName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Link dropdown */}
          <div className="relative" ref={linkDropdownRef}>
            <button
              onClick={() => setIsLinkOpen(!isLinkOpen)}
              className="size-10 rounded-full hover:bg-stone-200/50 flex justify-center items-center text-stone-600 dark:text-stone-300 transition-all hover:text-viet-red!"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical hover:text-viet-red"
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
                    to={link.url}
                    className={`whitespace-nowrap text-left px-4 py-2 text-xs font-medium hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-viet-red transition-colors flex justify-between items-center ${window.location.pathname.includes(link.url) ? "text-viet-red bg-stone-50 dark:bg-stone-700 font-extrabold" : "text-stone-600 dark:text-stone-300"}`}
                  >
                    {t(link.labelId)}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/*  */}
        </div>
      </div>
    </nav>
  );
};

const Layout: React.FC<{
  artifacts: Artifact[];
  children: React.ReactNode;
}> = ({ artifacts, children }) => {
  const location = useLocation();
  const isArtifactDetail = location.pathname.startsWith("/artifact/");

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <RandomArtifactButton artifacts={artifacts} />
      {!isArtifactDetail && <Footer />}
    </div>
  );
};

export default function App() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>(
    () => (localStorage.getItem("locale") as Locale) || "vi",
  );
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "system",
  );

  const parseCSV = (text: string): Artifact[] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = "";
    let inQuotes = false;
    const cleanText = text.replace(/^\uFEFF/, "");
    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const nextChar = cleanText[i + 1];
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"';
          i++;
        } else inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        currentRow.push(currentField);
        currentField = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && nextChar === "\n") i++;
        currentRow.push(currentField);
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else currentField += char;
    }
    if (currentField !== "" || currentRow.length > 0) {
      currentRow.push(currentField);
      rows.push(currentRow);
    }
    if (rows.length < 2) return [];
    const headers = rows[0].map((h) => h.trim());
    const results: Artifact[] = [];
    for (let i = 1; i < rows.length; i++) {
      const data = rows[i];
      if (data.length < headers.length) continue;
      const artifact: any = {};
      headers.forEach((header, index) => {
        const value = (data[index] || "").trim();
        if (header === "categories") {
          artifact[header] = value
            .split(/[\s,]+/)
            .filter(Boolean)
            .map((v) => v.trim());
        } else if (header === "supporting_images" || header === "sources") {
          if (value.includes("<iframe")) artifact[header] = [value];
          else
            artifact[header] = value
              .split(/[ \n;,]+/)
              .map((v) => v.trim())
              .filter(Boolean);
        } else artifact[header] = value;
      });
      if (!artifact.id) artifact.id = String(i);
      results.push(artifact as Artifact);
    }
    return results;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}&range=${SHEET_RANGE}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fetch failed");
        const text = await response.text();
        if (text.includes("<!DOCTYPE html>"))
          throw new Error("Invalid CSV (Access Denied)");
        setArtifacts(parseCSV(text));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = window.document.documentElement;
    const applyTheme = (isDark: boolean) => {
      isDark ? root.classList.add("dark") : root.classList.remove("dark");
    };
    if (theme === "system") {
      const sys = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(sys.matches);
      const l = (e: MediaQueryListEvent) => applyTheme(e.matches);
      sys.addEventListener("change", l);
      return () => sys.removeEventListener("change", l);
    } else applyTheme(theme === "dark");
  }, [theme]);

  const t = (key: string, params?: Record<string, string | number>) => {
    let str = translations[locale][key] || key;
    if (params)
      Object.entries(params).forEach(
        ([k, v]) => (str = str.replace(`{${k}}`, String(v))),
      );
    return str;
  };

  if (loading)
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
        <Logo className="w-16 h-16 text-viet-red animate-pulse" />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-stone-800 p-8 border-2 border-viet-red shadow-xl text-center font-medium">
          <h2 className="text-xl font-extrabold mb-4">{error}</h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-viet-red text-white px-6 py-2 font-bold"
          >
            Thử lại
          </button>
        </div>
      </div>
    );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <LanguageContext.Provider value={{ locale, setLocale, t }}>
        <BrowserRouter>
          <ScrollToTop />
          <Layout artifacts={artifacts}>
            <Routes>
              <Route path="/" element={<Home artifacts={artifacts} />} />
              <Route
                path="/search"
                element={<Search artifacts={artifacts} />}
              />
              <Route path="/saved" element={<Saved artifacts={artifacts} />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route
                path="/artifact/:id"
                element={<ArtifactDetail artifacts={artifacts} />}
              />
              <Route path="/references" element={<References />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}
