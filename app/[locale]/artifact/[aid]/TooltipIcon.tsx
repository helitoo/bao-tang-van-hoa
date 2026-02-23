export default function TooltipIcon({ text }: { text: string }) {
  return (
    <div className="group relative inline-flex ml-1 align-middle">
      <svg
        className="w-3 h-3 text-stone-400 dark:text-stone-500 hover:text-viet-red dark:hover:text-viet-red cursor-help transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-stone-900 dark:bg-stone-800 text-white text-[10px] font-medium normal-case leading-relaxed rounded shadow-xl z-[60] text-center border border-stone-700 dark:border-stone-600 animate-in fade-in slide-in-from-bottom-1">
        {text}
        <div className="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-stone-900 dark:border-t-stone-800"></div>
      </div>
    </div>
  );
}
