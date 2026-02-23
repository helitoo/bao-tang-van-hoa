export default function StatBarChart({
  title,
  data,
  total,
  className = "",
}: {
  title: string;
  data: { label: string; count: number }[] | undefined;
  total: number | undefined;
  className?: string;
}) {
  return (
    <div
      className={`bg-white dark:bg-stone-800/50 p-3 md:p-5 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col transition-colors duration-300 ${className}`}
    >
      <h4 className="text-[9px] md:text-[10px] font-extralight uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3 border-b border-stone-100 dark:border-stone-800 pb-2 flex items-center flex-shrink-0">
        <span className="w-1 h-1 bg-viet-red mr-2"></span>
        {title}
      </h4>
      <div
        className={`grow overflow-y-auto pr-2 custom-scrollbar space-y-2.5 ${(data === undefined || total === undefined) && "skeleton"}`}
      >
        {data !== undefined &&
          total !== undefined &&
          data.map((item, idx) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[8px] md:text-[9px] font-medium text-stone-600 dark:text-stone-400">
                  <span className="truncate pr-1">{item.label}</span>
                  <span className="font-bold tabular-nums">{item.count}</span>
                </div>
                <div className="w-full h-0.5 bg-stone-100 dark:bg-stone-900 overflow-hidden">
                  <div
                    className="h-full bg-viet-red transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.max(percentage, item.count > 0 ? 1 : 0)}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
