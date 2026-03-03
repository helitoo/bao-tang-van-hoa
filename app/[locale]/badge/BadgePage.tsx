"use client";

import { useState, useEffect } from "react";

import { type Badge, getBadges } from "@/lib/badgeManager";

export default function BadgePage({ dict }: { dict: any }) {
  const [badges, setBadges] = useState<Badge[] | undefined>();

  useEffect(() => setBadges(getBadges()), []);
  return (
    <div className="mb-12 font-sans text-gray-800">
      {badges && badges.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {badges.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center group m-5 md:mx-10 pb-2"
            >
              <img
                src={item.url}
                alt={item.name}
                className="h-40 md:h-50 w-auto object-contain"
                draggable={false}
              />

              <div className="flex-1">
                <h3 className="transition-colors text-center break-words dark:text-white">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className=" mt-25 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="70"
              height="70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heart-crack-icon lucide-heart-crack text-viet-red"
            >
              <path d="M12.409 5.824c-.702.792-1.15 1.496-1.415 2.166l2.153 2.156a.5.5 0 0 1 0 .707l-2.293 2.293a.5.5 0 0 0 0 .707L12 15" />
              <path d="M13.508 20.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.677.6.6 0 0 0 .818.001A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5z" />
            </svg>
            <h3 className="text-center font-normal whitespace-pre-line">
              {dict.not_found_badge}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
