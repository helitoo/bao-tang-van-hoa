import React from "react";
import { useLanguage } from "../App";
import ReferenceItem from "../components/ReferenceItem";
// Fix: Use namespace import for react-router-dom to resolve export issues
import * as ReactRouterDOM from "react-router-dom";
const { Link } = ReactRouterDOM;

const References: React.FC = () => {
  const { t } = useLanguage();

  const referenceLinks = [
    {
      name: "Hoa văn Đại Việt",
      url: "https://hoavandaiviet.vn/",
    },
    {
      name: "Đại Nam hoa văn mạn lục",
      url: "https://drive.google.com/drive/folders/1EWKhUWLbnvn9UmI-2ZGx7NnSZkqrymtm?usp=sharing",
    },
    {
      name: "Bác văn ước lễ",
      url: "https://www.facebook.com/bacvanuocle",
    },
    {
      name: "Lược sử tộc Việt",
      url: "https://www.facebook.com/lstvfanpage",
    },
    {
      name: "Đại Việt phong hoa",
      url: "https://www.facebook.com/Daivietphonghoa",
    },
    {
      name: "Đại Việt thần thoại",
      url: "https://www.facebook.com/profile.php?id=61571214249611",
    },
    {
      name: "Made in Vietnam",
      url: "https://www.facebook.com/madeinvietnam2024",
    },
    {
      name: "Hoàng triều Hậu Lê",
      url: "https://www.facebook.com/groups/423701537299844",
    },
    {
      name: "Đại Việt cổ phong",
      url: "https://www.facebook.com/groups/630359420385614",
    },
    {
      name: "Huế cổ phong",
      url: "https://www.facebook.com/groups/462469104898861",
    },
    {
      name: "Hoa văn cổ",
      url: "https://www.facebook.com/groups/24094649860154804",
    },
    {
      name: "Bửu liên - Đi cùng di sản",
      url: "https://www.tiktok.com/@buulien.dicungdisan",
    },
    {
      name: "Địa phương chí",
      url: "https://www.tiktok.com/@diaphuongchi",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 min-h-[calc(100vh-5rem)]">
      <div className="flex flex-col items-center mb-16 text-center">
        <nav className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-4">
          <Link to="/" className="hover:text-viet-red transition-colors">
            {t("nav_home")}
          </Link>
          <span>/</span>
          <span className="text-viet-red">{t("nav_references")}</span>
        </nav>
        <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-tight mb-4">
          {t("nav_references")}
        </h1>
        <div className="h-1 w-24 bg-viet-red shadow-lg mb-6"></div>
      </div>

      <div className="relative">
        <div className="halftone-bg absolute inset-0 -z-10 opacity-5 pointer-events-none"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {referenceLinks.map((link, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-[10px] font-extrabold tracking-[0.2em] text-stone-400 ml-1">
                {link.name}
              </h3>
              <ReferenceItem url={link.url} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default References;
