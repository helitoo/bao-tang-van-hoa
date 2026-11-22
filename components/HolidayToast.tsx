"use client";

import { useEffect, useRef } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import type { Locale } from "@/lib/lang";
import { getHolidayNotification } from "@/lib/holidayNotification";

const ONE_HOUR_MS = 60 * 60 * 1000; // 1 giờ tính bằng milliseconds

export default function HolidayToast({ locale }: { locale: Locale }) {
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    try {
      const holiday = getHolidayNotification(new Date(), locale);
      if (!holiday) return;

      const storageKey = `holiday_toast_last_shown_${holiday.id}`;
      const lastShownStr = localStorage.getItem(storageKey);
      const now = Date.now();

      const shouldShow =
        !lastShownStr || now - Number(lastShownStr) >= ONE_HOUR_MS;

      if (shouldShow) {
        // Cập nhật mốc thời gian hiển thị cuối
        localStorage.setItem(storageKey, String(now));

        // Trì hoãn nhẹ 600ms sau khi trang tải để hiệu ứng xuất hiện tự nhiên
        const timer = setTimeout(() => {
          toast(
            <div className="flex items-center space-x-3 py-1">
              <span className="text-2xl select-none shrink-0">🏛️</span>
              <div className="flex-1">
                <p className="text-xs md:text-sm font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                  {holiday.message}
                </p>
              </div>
            </div>,
            {
              position: "top-center",
              autoClose: 7000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              transition: Bounce,
              className:
                "!bg-white dark:!bg-stone-900 !text-stone-900 dark:!text-stone-100 !border-l-4 !border-viet-red !shadow-xl !rounded-sm",
            }
          );
        }, 600);

        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error("Failed to check holiday notification", e);
    }
  }, [locale]);

  return (
    <ToastContainer
      position="top-center"
      autoClose={7000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
  );
}
