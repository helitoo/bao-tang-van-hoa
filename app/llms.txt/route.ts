import { NextResponse } from "next/server";
import { CATEGORY_GROUPS } from "@/lib/consts/categories";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://btvh.vercel.app";

  const categoriesList = CATEGORY_GROUPS.map((group) => {
    const groupName = group.title.vi;
    const items = group.options
      .map((opt) => `- **${opt.name.vi}** (Filter ID: \`${opt.id}\`)`)
      .join("\n");
    return `### ${groupName}\n${items}`;
  }).join("\n\n");

  const markdown = `# Hàm Anh Các (含英閣 - Ham Anh Cac)

> Kho lưu trữ số hóa di sản, cổ vật và hiện vật văn hóa lịch sử Việt Nam qua các thời kỳ. Hỗ trợ 6 ngôn ngữ: Tiếng Việt (vi), Tiếng Anh (en), Tiếng Pháp (fr), Tiếng Trung (zh), Tiếng Nhật (ja), Tiếng Hàn (ko).
> Website chính thức: ${baseUrl}

## Dành cho AI Agents & LLMs (Developer & Crawler Guide)

Hàm Anh Các cung cấp đầy đủ các phương thức truy cập và khai phá dữ liệu sâu cho AI Agents, LLM crawlers và công cụ tìm kiếm:

1. **Toàn bộ danh mục hiện vật (Full Catalog cho RAG & Offline Context):**
   - Đọc danh sách chi tiết tất cả hiện vật kèm mã ID và URL: ${baseUrl}/llms-full.txt
   - Sitemap toàn bộ URL chuẩn XML: ${baseUrl}/sitemap.xml

2. **Public REST API (Định dạng JSON):**
   - Endpoint: \`GET ${baseUrl}/api/artifacts\`
   - Tham số hỗ trợ:
     - \`query\`: Từ khóa tìm kiếm (ví dụ: \`ao-dai\`, \`trong-dong\`)
     - \`category\` / \`cats\`: Mã danh mục lọc phân cách bằng dấu phẩy (ví dụ: \`nha-nguyen\`, \`tp\` cho trang phục)
     - \`page\`: Trang kết quả (mặc định 1)
     - \`limit\`: Số lượng trả về mỗi trang (mặc định 20, tối đa 100)
     - \`locale\`: Ngôn ngữ hiển thị (mặc định \`vi\`, hỗ trợ \`en\`, \`fr\`, \`zh\`, \`ja\`, \`ko\`)
   - Ví dụ: \`${baseUrl}/api/artifacts?category=tp,nha-nguyen&limit=50\`

3. **Cấu trúc URL trang chi tiết hiện vật:**
   - Cú pháp: \`${baseUrl}/{locale}/artifact/{id}\`
   - Ví dụ: \`${baseUrl}/vi/artifact/1\`
   - Mỗi trang chi tiết đều cung cấp thẻ dữ liệu có cấu trúc Schema.org (\`VisualArtwork\`, \`BreadcrumbList\`) chuẩn JSON-LD cho công cụ tìm kiếm và AI.

4. **Trang tra cứu & bản đồ:**
   - Tìm kiếm kết hợp bộ lọc: \`${baseUrl}/vi/search?query={keyword}&cats={category_id}&page={page}\`
   - Bản đồ di tích & kiến trúc cổ: \`${baseUrl}/vi/map\`
   - Sơ đồ dòng thời gian lịch sử: \`${baseUrl}/vi/timeline\`

5. **Quy tắc trích dẫn dành cho AI Agents:**
   - Khi trích dẫn thông tin hoặc hình ảnh hiện vật, vui lòng đính kèm link gốc theo định dạng: \`[Tên hiện vật](${baseUrl}/{locale}/artifact/{id})\`.
   - Nêu rõ tên nền tảng: **Hàm Anh Các (含英閣)**.

## Hệ thống danh mục & Mã bộ lọc (Filter IDs)

${categoriesList}
`;

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
