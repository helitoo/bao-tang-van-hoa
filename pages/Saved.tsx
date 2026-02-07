
import React, { useMemo, useState, useEffect } from 'react';
import { Artifact } from '../types';
import { useLanguage } from '../App';
import ArtifactCard from '../components/ArtifactCard';
// Fix: Use namespace import for react-router-dom to resolve export issues
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;

interface SavedProps {
  artifacts: Artifact[];
}

const Saved: React.FC<SavedProps> = ({ artifacts }) => {
  const { t } = useLanguage();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('saved_artifacts');
    if (saved) {
      try {
        setSavedIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved artifacts", e);
      }
    }
  }, []);

  const savedResults = useMemo(() => {
    return artifacts.filter(a => savedIds.includes(a.id));
  }, [artifacts, savedIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-2 border-stone-200 dark:border-stone-800 pb-4 gap-4">
        <div>
          <nav className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400 font-bold uppercase mb-2">
            <Link to="/" className="hover:text-viet-red transition-colors">{t('nav_home')}</Link>
            <span>/</span>
            <span className="text-viet-red">{t('nav_saved')}</span>
          </nav>
          <h2 className="text-4xl font-serif-display dark:text-stone-100 italic">
            {t('saved_title')}
          </h2>
        </div>
        <span className="text-stone-500 font-medium italic text-sm">
          {savedResults.length} {t('artifacts')}
        </span>
      </div>

      {savedResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {savedResults.map((item) => (
            <ArtifactCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center space-y-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm">
          <svg className="w-16 h-16 mx-auto text-stone-200 dark:text-stone-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-stone-400 dark:text-stone-500 italic font-serif text-lg">{t('saved_empty')}</p>
          <Link to="/search" className="inline-block bg-viet-red hover:bg-red-800 text-white px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all">
            {t('hero_btn')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Saved;
