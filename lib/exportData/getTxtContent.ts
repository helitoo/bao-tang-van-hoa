import type { Artifact } from "@/contexts/artifact";
import { FIELD_CONTENT_MAP } from "@/lib/exportData/dataMetadata";

export function getTxtContent(
  artifacts: Artifact[],
  selectedHeaders: { key: string; label: string }[],
) {
  return (
    artifacts
      .map((a) => {
        const lines = selectedHeaders.map(({ key, label }) => {
          const typedKey = key as keyof typeof FIELD_CONTENT_MAP;
          const rawVal = FIELD_CONTENT_MAP[typedKey](a);

          if (!rawVal) return null;

          const val = String(rawVal).trim();

          // Kiểm tra multi-line
          const isMultiLine = val.includes("\n");

          if (isMultiLine) {
            return `${label}:\n\t"${val}"`;
          }

          return `${label}: ${val}.`;
        });

        // Loại bỏ null và join thành 1 artifact block
        return lines.filter(Boolean).join("\n");
      })
      // Ngăn cách giữa các artifact
      .join("\n---\n")
  );
}
