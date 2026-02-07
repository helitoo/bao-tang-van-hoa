
import React from 'react';
// Fix: Use namespace import for react-router-dom to resolve export issues
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { useLanguage } from '../App';

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

const Footer: React.FC<FooterProps> = ({ isSidebar = false }) => {
  const { t } = useLanguage();
  return (
    <footer className={`bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 transition-colors duration-300 ${isSidebar ? 'py-8 px-6' : 'py-12 px-4 sm:px-6 lg:px-8'}`}>
      <div className={isSidebar ? 'space-y-8' : 'max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12'}>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Logo className="w-8 h-8 text-viet-red" />
            <span className="text-lg font-extrabold text-stone-900 dark:text-stone-100 uppercase">{t('museum_name')}</span>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed italic font-medium">
            {t('footer_desc')}
          </p>
          <div className="pt-2">
             <span className="text-[10px] font-extrabold uppercase tracking-widest text-viet-red bg-red-50 dark:bg-red-900/10 px-2 py-1 border border-red-100 dark:border-red-900/30">
               {t('footer_note')}
             </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2">{t('footer_links')}</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li><Link to="/" className="text-stone-500 dark:text-stone-400 hover:text-viet-red transition-colors">{t('nav_home')}</Link></li>
            <li><Link to="/search" className="text-stone-500 dark:text-stone-400 hover:text-viet-red transition-colors">{t('nav_search')}</Link></li>
            <li><Link to="/timeline" className="text-stone-500 dark:text-stone-400 hover:text-viet-red transition-colors">{t('nav_timeline')}</Link></li>
            <li><Link to="/saved" className="text-stone-500 dark:text-stone-400 hover:text-viet-red transition-colors">{t('nav_saved')}</Link></li>
            <li><Link to="/references" className="text-stone-500 dark:text-stone-400 hover:text-viet-red transition-colors">{t('nav_references')}</Link></li>
            <li><button className="text-stone-500 dark:text-stone-400 hover:text-viet-red transition-colors text-left">{t('nav_contribute')}</button></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2">{t('footer_support')}</h4>
          <ul className="space-y-2 text-sm text-stone-500 dark:text-stone-400 font-medium">
            <li className="hover:text-viet-red transition-colors cursor-pointer">{t('footer_report')}</li>
            <li className="text-[10px] opacity-70 mt-4 leading-relaxed font-extralight">
              © {new Date().getFullYear()} {t('museum_name')}. <br/>
              All rights reserved.
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
