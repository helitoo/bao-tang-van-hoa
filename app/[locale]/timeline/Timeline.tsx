"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { Locale } from "@/lib/lang";
import { parseYear } from "@/app/[locale]/timeline/parseYear";
import { HISTORY_DATA } from "@/lib/consts/history";

export default function Timeline({
  locale,
  dict,
}: {
  locale: Locale;
  dict: any;
}) {
  const [zoom, setZoom] = useState(1);
  const [hoveredItem, setHoveredItem] = useState<any | null>(null);

  const BASE_BAR_HEIGHT = 40;
  const BASE_FONT_SIZE = 11;

  const processedData = useMemo(() => {
    const raw = HISTORY_DATA.map((item) => {
      const startVal = parseYear(item.start);
      const endVal = parseYear(item.end);
      const duration = Math.abs(endVal - startVal);

      let barHeight;
      if (duration < 100) {
        const growthFactor = 2 * (1 - duration / 100);
        barHeight = BASE_BAR_HEIGHT * (1 + growthFactor);
      } else {
        barHeight = BASE_BAR_HEIGHT;
      }

      let fontSize = BASE_FONT_SIZE;
      if (item.type === "war") fontSize = BASE_FONT_SIZE * 0.75;
      else if (item.type === "independence") fontSize = BASE_FONT_SIZE * 1.25;

      return {
        ...item,
        startVal,
        endVal,
        duration,
        barHeight,
        fontSize,
      };
    });

    return raw.sort((a, b) => b.duration - a.duration);
  }, []);

  const minYear = Math.min(...processedData.map((d) => d.startVal));
  const maxYear = Math.max(...processedData.map((d) => d.endVal));
  const totalYears = maxYear - minYear;

  const uniqueYears = useMemo(() => {
    const years = new Set<number>();
    processedData.forEach((item) => {
      years.add(item.startVal);
      years.add(item.endVal);
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [processedData]);

  const getSegmentColor = (type: string) => {
    return type === "independence"
      ? "#f59e0b"
      : type === "war"
        ? "#b663f1"
        : "#6366f1";
  };

  const VIEWPORT_HEIGHT = 400;
  const Y_AXIS = 300;
  const SVG_BASE_WIDTH = 1000;
  const currentWidth = SVG_BASE_WIDTH * zoom;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Zoom Control */}
      <div className="flex flex-col items-center space-y-2 max-w-xs mx-auto mb-6">
        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 flex justify-between w-full">
          <span>{dict.timeline_zoom}</span>
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

      {/* Interactive Hover Card */}
      <div className="h-14 mb-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {hoveredItem ? (
            <motion.div
              key={hoveredItem.name[locale] || hoveredItem.name.vi}
              initial={{ opacity: 0, scale: 0.95, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.2 }}
              className="px-5 py-2.5 rounded-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-md flex items-center gap-4 text-xs"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: getSegmentColor(hoveredItem.type) }}
              ></div>
              <div>
                <span className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                  {hoveredItem.name[locale] ||
                    hoveredItem.name.en ||
                    hoveredItem.name.vi}
                </span>
                <span className="text-stone-400 dark:text-stone-500 ml-2 font-mono">
                  ({hoveredItem.start} &rarr; {hoveredItem.end})
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                {hoveredItem.duration} năm
              </span>
            </motion.div>
          ) : (
            <span className="text-xs text-stone-400 italic">
              (Rê chuột vào một thời kỳ trên sơ đồ để xem niên biểu chi tiết)
            </span>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline Scroll Area */}
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
              x1="0"
              y1={Y_AXIS}
              x2={currentWidth}
              y2={Y_AXIS}
              stroke="#d6d3d1"
              strokeWidth="1"
            />

            {/* Year Ticks and Axis */}
            {uniqueYears.map((year, i) => {
              const currentYear = new Date().getFullYear();
              const x = ((year - minYear) / totalYears) * currentWidth;
              const isNow = year === currentYear;

              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={Y_AXIS}
                    x2={x}
                    y2={Y_AXIS + 6}
                    stroke="#d6d3d1"
                    strokeWidth="1"
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
                    {isNow ? dict.timeline_now : Math.abs(year)}{" "}
                    {!isNow && year < 0 ? dict.timeline_bce : ""}
                  </text>
                </g>
              );
            })}

            {/* History Segments */}
            {processedData.map((item, index) => {
              const xStart =
                ((item.startVal - minYear) / totalYears) * currentWidth;
              const xEnd =
                ((item.endVal - minYear) / totalYears) * currentWidth;
              const width = Math.max(xEnd - xStart, 2);
              const color = getSegmentColor(item.type);
              const midX = xStart + width / 2;
              const h = item.barHeight;
              const yRect = Y_AXIS - h;

              return (
                <g
                  key={index}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* PRECISION TRIGGER */}
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
                      className="group-hover:fill-opacity-95 transition-all duration-300"
                    />

                    <text
                      x={midX}
                      y={yRect - 12}
                      fontSize={item.fontSize}
                      fontWeight="bold"
                      fill={color}
                      className="transition-opacity duration-300 group-hover:opacity-100"
                      transform={`rotate(-90, ${midX}, ${yRect - 12})`}
                      textAnchor="start"
                      dominantBaseline="middle"
                    >
                      {item.name[locale] || item.name.en || item.name.vi}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
