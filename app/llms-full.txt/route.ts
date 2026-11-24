import { NextResponse } from "next/server";
import { fetchArtifactsServer } from "@/lib/serverArtifacts";
import { getCategoryNames } from "@/lib/consts/categories";

export async function GET() {
  try {
    const artifacts = await fetchArtifactsServer();

    let output = `# Danh mục toàn bộ hiện vật - Hàm Anh Các (含英閣 - Ham Anh Cac)
Website: https://btvh.vercel.app
Tổng số hiện vật: ${artifacts.length}
Cập nhật: ${new Date().toISOString()}

---
`;

    for (const a of artifacts) {
      const catNames = a.categories
        ? getCategoryNames(a.categories, "vi")
        : "";
      const desc = (a.short_description || a.description || "")
        .replace(/\r?\n|\r/g, " ")
        .slice(0, 300);
      const sourceUrl =
        a.source_url ||
        (a.sources || a.supporting_images || []).find(
          (s) => s.startsWith("http://") || s.startsWith("https://"),
        ) ||
        "";

      output += `
## [${a.id}] ${a.name}
- **Mã hiện vật (ID):** ${a.id}
- **URL chi tiết:** https://btvh.vercel.app/vi/artifact/${a.id}${sourceUrl ? `\n- **Nguồn gốc / Bảo tàng gốc:** ${sourceUrl}` : ""}
- **Thời đại / Niên đại:** ${a.artifact_date || "Chưa rõ"}
- **Địa điểm / Xuất xứ:** ${a.location || "Việt Nam"}
- **Tác giả / Nghệ nhân:** ${a.author || "Khuyết danh"}
- **Danh mục / Phân loại:** ${catNames || (a.categories || []).join(", ")}
- **Hình ảnh:** ${a.main_image}
- **Mô tả:** ${desc}
---`;
    }

    return new NextResponse(output, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating llms-full.txt:", error);
    return new NextResponse("Failed to generate catalog", { status: 500 });
  }
}
