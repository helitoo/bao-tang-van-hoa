"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useArtifact } from "@/contexts/artifact";
import { Locale } from "@/lib/lang";

export default function RandomArtifactButton({ locale }: { locale: Locale }) {
  const router = useRouter();
  const { artifacts } = useArtifact();

  const pickRandom = () => {
    if (!artifacts) return;

    const randomIndex = Math.floor(Math.random() * artifacts.length);
    const selected = artifacts[randomIndex];
    if (selected && selected.id)
      router.push(`/${locale}/artifact/${selected.id}`);
  };

  if (!artifacts) return <></>;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[60] flex items-center justify-end"
      initial={{ scale: 0, rotate: -90, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
    >
      {/* Subtle pulse ring behind button */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-viet-red opacity-30 animate-ping pointer-events-none"></span>

      <motion.button
        onClick={pickRandom}
        whileHover={{
          scale: 1.1,
          rotate: 15,
          boxShadow: "0 10px 25px -5px rgba(185, 28, 28, 0.5)",
        }}
        whileTap={{ scale: 0.92, rotate: -15 }}
        className="relative btn bg-viet-red text-white p-3.5 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center cursor-pointer"
        title="Khám phá ngẫu nhiên (I feel lucky)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-dices"
        >
          <rect width="12" height="12" x="2" y="10" rx="2" ry="2" />
          <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" />
          <path d="M6 18h.01" />
          <path d="M10 14h.01" />
          <path d="M15 6h.01" />
          <path d="M18 9h.01" />
        </svg>
      </motion.button>
    </motion.div>
  );
}
