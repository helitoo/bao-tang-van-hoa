
import React, { useState, useMemo, useRef } from 'react';
import { HISTORY_DATA } from '../constants';
import { useLanguage } from '../App';

const parseYear = (yearStr: string): number => {
  const currentYear = new Date().getFullYear();
  if (yearStr === 'nay') return currentYear;
  const num = parseInt(yearStr);
  if (yearStr.includes('TCN')) return -num;
  return num;
};

const Timeline: React.FC = () => {
  const { t, locale } = useLanguage();
  const [zoom, setZoom] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);

  const BASE_BAR_HEIGHT = 40;
  const BASE_FONT_SIZE = 11;

  const processedData = useMemo(() => {
    const raw = HISTORY_DATA.map(item => {
      const startVal = parseYear(item.start);
      const endVal = parseYear(item.end);
      const duration = Math.abs(endVal - startVal);
      
      // Calculate dynamic height: 100 years is standard (BASE_BAR_HEIGHT).
      // Shorter durations (< 100 years) increase height. 
      // Max height is 3x BASE_BAR_HEIGHT (120px) when duration is 0.
      let barHeight;
      if (duration < 100) {
        const growthFactor = 2 * (1 - duration / 100); 
        barHeight = BASE_BAR_HEIGHT * (1 + growthFactor);
      } else {
        barHeight = BASE_BAR_HEIGHT;
      }

      // Calculate font size adjustments
      let fontSize = BASE_FONT_SIZE;
      if (item.type === 'war') fontSize = BASE_FONT_SIZE * 0.75;
      else if (item.type === 'independence') fontSize = BASE_FONT_SIZE * 1.25;

      return {
        ...item,
        startVal,
        endVal,
        duration,
        barHeight,
        fontSize
      };
    });

    // Sort by duration descending so smaller (narrower but taller) segments are drawn on top
    return raw.sort((a, b) => b.duration - a.duration);
  }, []);

  const minYear = Math.min(...processedData.map(d => d.startVal));
  const maxYear = Math.max(...processedData.map(d => d.endVal));
  const totalYears = maxYear - minYear;

  const uniqueYears = useMemo(() => {
    const years = new Set<number>();
    processedData.forEach(item => {
      years.add(item.startVal);
      years.add(item.endVal);
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [processedData]);

  const getSegmentColor = (type: string) => {
    return type === 'independence' ? '#f59e0b' : (type === 'war' ? '#b663f1' : '#6366f1');
  };

  const VIEWPORT_HEIGHT = 400;
  const Y_AXIS = 300; // Vertical position of the horizontal axis
  const SVG_BASE_WIDTH = 2000;
  const currentWidth = SVG_BASE_WIDTH * zoom;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-5rem)] flex flex-col relative" ref={containerRef}>
      <div className="text-center mb-6">
        <h2 className="text-4xl md:text-5xl font-serif-display text-stone-900 dark:text-stone-100 italic mb-4">
          {t('timeline_title')}
        </h2>
        
        <div className="flex flex-col items-center space-y-2 max-w-xs mx-auto">
          <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 flex justify-between w-full">
            <span>{t('timeline_zoom')}</span>
            <span>{zoom.toFixed(1)}x</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="0.5" 
            value={zoom} 
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-viet-red"
          />
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-hidden py-12 px-2 border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 rounded-sm shadow-inner always-show-scrollbar custom-scrollbar-h relative">
        <div 
          className="relative transition-all duration-300 ease-out" 
          style={{ width: `${currentWidth}px`, height: `${VIEWPORT_HEIGHT}px` }}
        >
          <svg 
            viewBox={`0 0 ${currentWidth} ${VIEWPORT_HEIGHT}`} 
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Main Axis Line */}
            <line 
              x1="0" y1={Y_AXIS} 
              x2={currentWidth} y2={Y_AXIS} 
              stroke="#d6d3d1" strokeWidth="1" 
            />

            {/* Year Ticks and Axis */}
            {uniqueYears.map((year, i) => {
              const currentYear = new Date().getFullYear();
              const x = ((year - minYear) / totalYears) * currentWidth;
              const isNow = year === currentYear;
              
              return (
                <g key={i}>
                  <line 
                    x1={x} y1={Y_AXIS} 
                    x2={x} y2={Y_AXIS + 6} 
                    stroke="#d6d3d1" strokeWidth="1" 
                  />
                  <text 
                    x={x} 
                    y={Y_AXIS + 15} 
                    fontSize="9" 
                    fontWeight="bold" 
                    className="fill-stone-400 font-bold" 
                    transform={`rotate(90, ${x}, ${Y_AXIS + 15})`} 
                    textAnchor="start"
                    dominantBaseline="middle"
                  >
                    {isNow ? t('timeline_now') : Math.abs(year)} {!isNow && year < 0 ? t('timeline_bce') : ''}
                  </text>
                </g>
              );
            })}

            {/* History Segments */}
            {processedData.map((item, index) => {
              const xStart = ((item.startVal - minYear) / totalYears) * currentWidth;
              const xEnd = ((item.endVal - minYear) / totalYears) * currentWidth;
              const width = Math.max(xEnd - xStart, 2);
              const color = getSegmentColor(item.type);
              const midX = xStart + width / 2;
              const h = item.barHeight;
              const yRect = Y_AXIS - h;

              return (
                <g 
                  key={index} 
                  className="group cursor-pointer"
                >
                  {/* PRECISION TRIGGER: Matches the segment and the vertical label area exactly. */}
                  <rect 
                    x={xStart} 
                    y={yRect} 
                    width={width} 
                    height={h} 
                    fill="transparent"
                  />
                  <rect 
                    x={midX - 15} 
                    y={yRect - 120} 
                    width={30} 
                    height={120} 
                    fill="transparent"
                  />
                  
                  {/* MOVING CONTENT */}
                  <g className="transition-transform duration-300 ease-out group-hover:-translate-y-[30px] pointer-events-none">
                    <rect 
                      x={xStart} 
                      y={yRect} 
                      width={width} 
                      height={h} 
                      fill={color} 
                      fillOpacity="0.5"
                      stroke="white" 
                      strokeWidth="0.5"
                      className="group-hover:fill-opacity-90 transition-all duration-300"
                    />
                    
                    <text 
                      x={midX} 
                      y={yRect - 12} 
                      fontSize={item.fontSize} 
                      fontWeight="bold" 
                      fill={color}
                      className="font-serif italic transition-opacity duration-300 group-hover:opacity-100" 
                      transform={`rotate(-90, ${midX}, ${yRect - 12})`}
                      textAnchor="start"
                      dominantBaseline="middle"
                    >
                      {item.name[locale]}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <style>{`
        .always-show-scrollbar { overflow-x: scroll !important; }
        .custom-scrollbar-h::-webkit-scrollbar { height: 10px; }
        .custom-scrollbar-h::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 5px; }
        .dark .custom-scrollbar-h::-webkit-scrollbar-track { background: #1c1917; }
        .custom-scrollbar-h::-webkit-scrollbar-thumb { background: #b91c1c; border-radius: 5px; border: 2px solid #f1f1f1; }
        .dark .custom-scrollbar-h::-webkit-scrollbar-thumb { border-color: #1c1917; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 14px; width: 14px; border-radius: 50%;
          background: #b91c1c; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default Timeline;
