import { NextResponse } from "next/server";
import { CATEGORY_GROUPS } from "@/lib/consts/categories";

export async function GET() {
  const categoriesList = CATEGORY_GROUPS.map((group) => {
    const groupName = group.title.vi;
    const items = group.options
      .map((opt) => `- **${opt.name.vi}** (mã filter: \`${opt.id}\`)`)
      .join("\n");
    return `### ${groupName}\n${items}`;
  }).join("\n\n");

  const markdown = `# Hàm Anh Các (含英閣 - Ham Anh Cac)

> Kho lưu trữ số hóa di sản, cổ vật và hiện vật văn hóa lịch sử Việt Nam qua các thời kỳ. Hỗ trợ 6 ngôn ngữ: Tiếng Việt, Tiếng Anh, Tiếng Pháp, Tiếng Trung, Tiếng Nhật, Tiếng Hàn.
> Website chính thức: https://btvh.vercel.app

## Dành cho AI Agents & LLMs

Website cung cấp đầy đủ các phương thức truy cập và khai phá dữ liệu sâu cho AI Agent:

1. **Toàn bộ danh mục hiện vật (Full Catalog):**
   - Đọc danh sách chi tiết tất cả hiện vật kèm mã ID và URL: https://btvh.vercel.app/llms-full.txt
   - Sitemap toàn bộ URL: https://btvh.vercel.app/sitemap.xml

2. **Public REST API (Định dạng JSON):**
   - Endpoint: \`GET https://btvh.vercel.app/api/artifacts\`
   - Tham số hỗ trợ:
     - \`query\`: Từ khóa tìm kiếm (ví dụ: \`ao-dai\`, \`trong-dong\`)
     - \`category\` / \`cats\`: Mã danh mục lọc (ví dụ: \`nha-nguyen\`, \`tp\` cho trang phục)
     - \`page\`: Trang kết quả (mặc định 1)
     - \`limit\`: Số lượng trả về (mặc định 20, tối đa 100)
     - \`locale\`: Ngôn ngữ (mặc định \`vi\`)
   - Ví dụ: \`https://btvh.vercel.app/api/artifacts?category=tp,nha-nguyen&limit=50\`

3. **Cấu trúc URL trang chi tiết hiện vật:**
   - Cú pháp: \`https://btvh.vercel.app/{locale}/artifact/{id}\`
   - Ví dụ: \`https://btvh.vercel.app/vi/artifact/1\`
   - Mỗi trang chi tiết đều có thẻ Schema.org \`VisualArtwork\` và \`BreadcrumbList\` chuẩn JSON-LD.

4. **Trang tìm kiếm trên giao diện:**
   - Tìm kiếm kết hợp bộ lọc: \`https://btvh.vercel.app/vi/search?query={keyword}&cats={category_id}&page={page}\`

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
