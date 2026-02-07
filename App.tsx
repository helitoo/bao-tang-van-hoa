import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
// Fix: Use namespace import for react-router-dom to resolve export issues
import * as ReactRouterDOM from "react-router-dom";
const { HashRouter, Routes, Route, Link, useNavigate, useLocation } =
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
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
        />
      </svg>
    ),
    dark: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
    system: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"
        />
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
      className="p-2 rounded-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-viet-red transition-all shadow-sm"
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
        className="bg-viet-red hover:bg-red-800 text-white p-3 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 border-2 border-white/20"
      >
        <svg
          className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"></circle>
          <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"></circle>
          <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"></circle>
          <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor"></circle>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>
        </svg>
      </button>
    </div>
  );
};

const Navbar = () => {
  const { locale, t, setLocale } = useLanguage();
  const [searchValue, setSearchValue] = useState("");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (searchValue.trim())
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    else navigate("/search");
  };

  const languages: { code: Locale; label: string; fullName: string }[] = [
    { code: "vi", label: "VN", fullName: "Tiếng Việt" },
    { code: "en", label: "EN", fullName: "English" },
    { code: "zh", label: "中", fullName: "中文" },
    { code: "ja", label: "日", fullName: "日本語" },
    { code: "ko", label: "한", fullName: "한국어" },
  ];
  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      )
        setIsLangOpen(false);
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

        {/* Search Box */}
        <div className="flex-1 max-w-xl relative flex items-center">
          <input
            type="text"
            placeholder={t("nav_placeholder")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-sm px-4 py-1.5 focus:outline-none focus:border-viet-red transition-colors text-sm shadow-sm font-medium"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-3 text-stone-400 hover:text-viet-red flex items-center"
            aria-label="Search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            title={t("nav_contribute")}
            className="flex items-center justify-center p-2.5 md:px-3 md:py-2 md:space-x-1 rounded-full md:rounded-sm text-stone-500 hover:text-viet-red hover:bg-stone-200 md:hover:bg-transparent dark:hover:bg-stone-800 md:dark:hover:bg-transparent transition-all"
          >
            <svg
              className="w-6 h-6 md:w-4 md:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="hidden md:inline text-[10px] font-extrabold uppercase tracking-wider">
              {t("nav_contribute")}
            </span>
          </button>

          <Link
            to="/saved"
            title={t("nav_saved")}
            className={`flex items-center justify-center p-2.5 md:px-3 md:py-2 md:space-x-1 rounded-full md:rounded-sm transition-all ${location.pathname === "/saved" ? "text-viet-red bg-red-50 md:bg-transparent dark:bg-red-900/10 md:dark:bg-transparent" : "text-stone-500 hover:text-viet-red hover:bg-stone-200 md:hover:bg-transparent dark:hover:bg-stone-800 md:dark:hover:bg-transparent"}`}
          >
            <svg
              className="w-6 h-6 md:w-4 md:h-4"
              fill={location.pathname === "/saved" ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span className="hidden md:inline text-[10px] font-extrabold uppercase tracking-wider">
              {t("nav_saved")}
            </span>
          </Link>

          {/* Additional Elements - Only shown on md and up */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeSwitcher />

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 px-3 py-1.5 rounded-sm shadow-sm hover:border-viet-red transition-all"
              >
                <span className="text-[10px] font-extrabold text-stone-700 dark:text-stone-300 uppercase">
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
          </div>
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
        <HashRouter>
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
        </HashRouter>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}
