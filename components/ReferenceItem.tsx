
import React from 'react';
import { useLanguage } from '../App';

interface ReferenceItemProps {
  url: string;
}

const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
};

const isImageUrl = (url: string) => {
  // Kiểm tra các định dạng ảnh phổ biến
  return /\.(jpg|jpeg|png|webp|gif|svg|bmp|jfif|avif)(\?.*)?$/i.test(url);
};

const getCleanHostname = (url: string) => {
  try {
    // Lấy hostname và loại bỏ 'www.' để làm tiêu đề
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'link';
  }
};

const ReferenceItem: React.FC<ReferenceItemProps> = ({ url }) => {
  const { t } = useLanguage();
  const favicon = getFaviconUrl(url);
  const hostname = getCleanHostname(url);
  const isImg = isImageUrl(url);
  const cleanUrl = url.trim();

  return (
    <div className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm overflow-hidden transition-all hover:border-viet-red shadow-sm">
      <div className="p-4 flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          {/* 1. Favicon / Icon */}
          <div className="w-8 h-8 flex-shrink-0 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center rounded-sm overflow-hidden">
            {favicon ? (
              <img 
                src={favicon} 
                alt="favicon" 
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            )}
          </div>

          {/* 2. Domain Title & 3. Display URL */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 truncate group-hover:text-viet-red transition-colors lowercase tracking-tight">
              {hostname}
            </h4>
            <a 
              href={cleanUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] text-stone-400 hover:text-viet-red truncate block transition-colors font-mono"
            >
              {cleanUrl}
            </a>
          </div>

          <a 
            href={cleanUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-stone-300 group-hover:text-viet-red transition-all transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>

        {/* 4. Image Preview (Hiển thị nếu là URL của ảnh) */}
        {isImg && (
          <div className="pt-2">
            <div className="aspect-video bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-sm overflow-hidden relative">
              <img 
                src={cleanUrl} 
                alt="Reference preview" 
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                   (e.target as HTMLImageElement).parentElement?.classList.add('hidden');
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferenceItem;
