"use client";

import { useCallback, useState } from "react";
import { FALLBACK_IMAGE } from "@/lib/imgProcessor";

type Status = "loading" | "loaded" | "error";

interface SkeletonImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "onLoad" | "onError"> {
  src: string;
  /** Classes for the wrapper that holds the skeleton and the image */
  wrapperClassName?: string;
  /** Classes added to the wrapper only while loading (e.g. a min-height) */
  loadingClassName?: string;
  /** Classes added to the image when it falls back after a failed load */
  fallbackClassName?: string;
}

/**
 * Shows a shimmering skeleton while the image is loading and only switches
 * to the fallback image when loading actually fails.
 */
export default function SkeletonImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  loadingClassName = "",
  fallbackClassName = "object-contain! p-6 opacity-60",
  ...imgProps
}: SkeletonImageProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [prevSrc, setPrevSrc] = useState(src);

  // Reset when the source changes (adjusting state during render, no effect needed)
  if (prevSrc !== src) {
    setPrevSrc(src);
    setStatus("loading");
  }

  // A server-rendered or cached image can finish before React attaches onLoad/onError
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (!img || !img.complete) return;
    setStatus((prev) =>
      prev !== "loading" ? prev : img.naturalWidth > 0 ? "loaded" : "error",
    );
  }, []);

  const isError = status === "error";

  return (
    <div
      className={`relative w-full h-full ${wrapperClassName} ${
        status === "loading" ? loadingClassName : ""
      }`}
    >
      {status === "loading" && (
        <div className="skeleton absolute inset-0 rounded-none!" aria-hidden="true" />
      )}
      <img
        {...imgProps}
        ref={imgRef}
        src={isError ? FALLBACK_IMAGE : src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          status === "loading" ? "opacity-0" : "opacity-100"
        } ${isError ? fallbackClassName : ""}`}
        onLoad={() => {
          if (!isError) setStatus("loaded");
        }}
        onError={() => {
          if (!isError) setStatus("error");
        }}
      />
    </div>
  );
}
