"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import type { Locale } from "@/lib/lang";
import {
  checkHoliday,
  calculateToastDuration,
  type HolidayInfo,
} from "@/lib/holidayNotification";

const ONE_HOUR_MS = 60 * 60 * 1000; // 1 giờ

function ArrowRight({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function XMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function HolidayToast({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [holiday, setHoliday] = useState<HolidayInfo | null>(null);
  const [visible, setVisible] = useState(false);
  const [duration, setDuration] = useState(6000);
  const [timeLeft, setTimeLeft] = useState(6000);
  const [isHovered, setIsHovered] = useState(false);

  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    try {
      const detected = checkHoliday(new Date(), locale);
      if (!detected) return;

      const storageKey = `holiday_toast_last_shown_${detected.id}`;
      const lastShownStr = localStorage.getItem(storageKey);
      const now = Date.now();

      const shouldShow =
        !lastShownStr || now - Number(lastShownStr) >= ONE_HOUR_MS;

      if (shouldShow) {
        localStorage.setItem(storageKey, String(now));
        const computedDuration = calculateToastDuration(detected.message, locale);
        setHoliday(detected);
        setDuration(computedDuration);
        setTimeLeft(computedDuration);

        // Xuất hiện mượt mà sau 600ms
        const timer = setTimeout(() => {
          setVisible(true);
        }, 600);

        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error("Failed to check holiday notification", e);
    }
  }, [locale]);

  // Bộ đếm thời gian tự tắt khi không hover
  useEffect(() => {
    if (!visible || isHovered) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(interval);
          setVisible(false);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [visible, isHovered]);

  const handleNavigate = () => {
    if (!holiday?.directUrl) return;
    setVisible(false);
    router.push(`/${locale}${holiday.directUrl}`);
  };

  return (
    <AnimatePresence>
      {visible && holiday && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -25, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[92vw] max-w-lg bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-lg shadow-2xl border-l-4 border-viet-red border border-stone-200/80 dark:border-stone-800/80 overflow-hidden select-none"
        >
          <div className="flex items-center gap-3 p-3.5 sm:p-4">
            <span className="text-2xl shrink-0">🏛️</span>

            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-100 leading-snug">
                {holiday.message}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {holiday.directUrl && (
                <button
                  type="button"
                  onClick={handleNavigate}
                  className="p-1.5 rounded-md text-stone-600 dark:text-stone-300 hover:text-viet-red dark:hover:text-viet-red hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  aria-label="Direct link"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setVisible(false)}
                className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <XMark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thanh progress bar đếm ngược */}
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-1">
            <div
              className="bg-viet-red h-full transition-all duration-100 ease-linear"
              style={{
                width: `${Math.max(0, Math.min(100, (timeLeft / duration) * 100))}%`,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
