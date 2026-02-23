import type { Locale } from "@/lib/lang";

export interface Category {
  id: string;
  name: Record<Locale, string>;
  groupId: "religion" | "genre" | "era" | "region";
}

export interface CategoryGroup {
  id: "religion" | "genre" | "era" | "region";
  title: Record<Locale, string>;
  options: Category[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "religion",
    title: {
      vi: "Phong tục & Tôn giáo",
      en: "Customs & Religion",
      zh: "习俗 & 宗教",
      ja: "風習と宗教",
      ko: "풍습 및 종교",
    },
    options: [
      {
        id: "pg",
        name: {
          vi: "Phật giáo",
          en: "Buddhism",
          zh: "佛教",
          ja: "仏教",
          ko: "불교",
        },
        groupId: "religion",
      },
      {
        id: "tg",
        name: {
          vi: "Tôn giáo khác",
          en: "Other religions",
          zh: "其他宗教",
          ja: "その他の宗教",
          ko: "기타 종교",
        },
        groupId: "religion",
      },
      {
        id: "pt",
        name: {
          vi: "Phong tục",
          en: "Customs",
          zh: "风俗",
          ja: "風習",
          ko: "풍습",
        },
        groupId: "religion",
      },
      {
        id: "tn",
        name: {
          vi: "Tín ngưỡng",
          en: "Beliefs",
          zh: "信仰",
          ja: "信仰",
          ko: "신앙",
        },
        groupId: "religion",
      },
      {
        id: "nv",
        name: {
          vi: "Nhân vật",
          en: "Characters",
          zh: "人物",
          ja: "人物",
          ko: "인물",
        },
        groupId: "religion",
      },
      {
        id: "lv",
        name: {
          vi: "Linh vật",
          en: "Mythical Creatures",
          zh: "神兽",
          ja: "霊獣",
          ko: "영물",
        },
        groupId: "religion",
      },
      {
        id: "tt",
        name: {
          vi: "Thần thánh",
          en: "Deities",
          zh: "神",
          ja: "神々",
          ko: "신",
        },
        groupId: "religion",
      },
      {
        id: "mq",
        name: {
          vi: "Ma quỷ",
          en: "Demons & Ghosts",
          zh: "妖魔鬼怪",
          ja: "魔物 / 幽霊",
          ko: "마귀 / 귀신",
        },
        groupId: "religion",
      },
    ],
  },
  {
    id: "region",
    title: { vi: "Khu vực", en: "Region", zh: "地区", ja: "地域", ko: "지역" },
    options: [
      {
        id: "mbac",
        name: {
          vi: "Miền Bắc",
          en: "Northern region",
          zh: "北部",
          ja: "北部",
          ko: "북부",
        },
        groupId: "region",
      },
      {
        id: "mtrung",
        name: {
          vi: "Miền Trung",
          en: "Central region",
          zh: "中部",
          ja: "中部",
          ko: "중부",
        },
        groupId: "region",
      },
      {
        id: "mnam",
        name: {
          vi: "Miền Nam",
          en: "Southern region",
          zh: "南部",
          ja: "南部",
          ko: "남부",
        },
        groupId: "region",
      },
      {
        id: "mnui",
        name: {
          vi: "Các dân tộc miền núi",
          en: "Highland ethnicities",
          zh: "高地民族",
          ja: "山岳民族",
          ko: "산악 민족",
        },
        groupId: "region",
      },
      {
        id: "nq",
        name: {
          vi: "Ngoại quốc",
          en: "Foreign",
          zh: "外国",
          ja: "外国",
          ko: "외국",
        },
        groupId: "region",
      },
    ],
  },
  {
    id: "genre",
    title: {
      vi: "Thể loại",
      en: "Genre",
      zh: "类型",
      ja: "ジャンル",
      ko: "장르",
    },
    options: [
      {
        id: "kt",
        name: {
          vi: "Kiến trúc",
          en: "Architecture",
          zh: "建筑",
          ja: "建築",
          ko: "건축",
        },
        groupId: "genre",
      },
      {
        id: "tp",
        name: {
          vi: "Trang phục",
          en: "Clothing",
          zh: "服装",
          ja: "衣装",
          ko: "의상",
        },
        groupId: "genre",
      },
      {
        id: "hv",
        name: {
          vi: "Hoa văn",
          en: "Patterns",
          zh: "图案",
          ja: "文様",
          ko: "문양",
        },
        groupId: "genre",
      },
      {
        id: "vt",
        name: {
          vi: "Văn thư",
          en: "Records",
          zh: "文书",
          ja: "文書",
          ko: "문서",
        },
        groupId: "genre",
      },
      {
        id: "qs",
        name: {
          vi: "Quân sự",
          en: "Military",
          zh: "军事",
          ja: "軍事",
          ko: "군사",
        },
        groupId: "genre",
      },
      {
        id: "an",
        name: {
          vi: "Âm nhạc",
          en: "Music",
          zh: "音乐",
          ja: "音楽",
          ko: "음악",
        },
        groupId: "genre",
      },
      {
        id: "dc",
        name: {
          vi: "Dụng cụ",
          en: "Utensils",
          zh: "器具",
          ja: "器具",
          ko: "기구",
        },
        groupId: "genre",
      },
      {
        id: "dk",
        name: {
          vi: "Điêu khắc",
          en: "Sculpture",
          zh: "雕塑",
          ja: "彫刻",
          ko: "조각",
        },
        groupId: "genre",
      },
      {
        id: "bvqg",
        name: {
          vi: "Bảo vật quốc gia",
          en: "National treasure",
          zh: "国宝",
          ja: "国宝",
          ko: "국보",
        },
        groupId: "genre",
      },
      {
        id: "dtqg",
        name: {
          vi: "Di tích quốc gia",
          en: "National site",
          zh: "国家古迹",
          ja: "国家指定史跡",
          ko: "국가 지정 문화재",
        },
        groupId: "genre",
      },
      {
        id: "dtqgdb",
        name: {
          vi: "Di tích quốc gia đặc biệt",
          en: "Special national site",
          zh: "全国重点文物保护单位",
          ja: "特別史跡",
          ko: "국가지정문화재",
        },
        groupId: "genre",
      },
      {
        id: "dstg",
        name: {
          vi: "Di sản thế giới",
          en: "World heritage",
          zh: "世界遗产",
          ja: "世界遺産",
          ko: "세계 유산",
        },
        groupId: "genre",
      },
    ],
  },
  {
    id: "era",
    title: { vi: "Thời đại", en: "Era", zh: "时代", ja: "時代", ko: "시대" },
    options: [
      {
        id: "cd",
        name: {
          vi: "Cổ đại",
          en: "Antiquity",
          zh: "古代",
          ja: "古代",
          ko: "고대",
        },
        groupId: "era",
      },
      {
        id: "champa",
        name: {
          vi: "Champa",
          en: "Champa",
          zh: "占婆",
          ja: "チャンパ",
          ko: "참파",
        },
        groupId: "era",
      },
      {
        id: "dl",
        name: {
          vi: "Thời kỳ độc lập sau Bắc thuộc",
          en: "Post-Chinese rule",
          zh: "越南独立时期",
          ja: "北属期後の独立時期",
          ko: "북속기 이후의 독립기",
        },
        groupId: "era",
      },
      {
        id: "ly",
        name: {
          vi: "Nhà Lý",
          en: "Lý Dynasty",
          zh: "李朝",
          ja: "李朝",
          ko: "리 왕조",
        },
        groupId: "era",
      },
      {
        id: "tran",
        name: {
          vi: "Nhà Trần",
          en: "Trần Dynasty",
          zh: "陈朝",
          ja: "陳朝",
          ko: "쩐 왕조",
        },
        groupId: "era",
      },
      {
        id: "ho",
        name: {
          vi: "Nhà Hồ",
          en: "Hồ Dynasty",
          zh: "胡朝",
          ja: "胡朝",
          ko: "호 왕조",
        },
        groupId: "era",
      },
      {
        id: "leso",
        name: {
          vi: "Nhà Lê sơ",
          en: "Early Lê Dynasty",
          zh: "黎初朝",
          ja: "黎朝",
          ko: "레 왕조",
        },
        groupId: "era",
      },
      {
        id: "mac",
        name: {
          vi: "Nhà Mạc",
          en: "Mạc Dynasty",
          zh: "莫朝",
          ja: "莫朝",
          ko: "막 왕조",
        },
        groupId: "era",
      },
      {
        id: "leth",
        name: {
          vi: "Nhà Lê trung hưng",
          en: "Revival Lê Dynasty",
          zh: "黎中興朝",
          ja: "黎中興朝",
          ko: "후기 레 왕조",
        },
        groupId: "era",
      },
      {
        id: "ts",
        name: {
          vi: "Nhà Tây sơn",
          en: "Tây-sơn Dynasty",
          zh: "西山朝",
          ja: "西山朝",
          ko: "떠이선 왕조",
        },
        groupId: "era",
      },
      {
        id: "nguyen",
        name: {
          vi: "Nhà Nguyễn",
          en: "Nguyễn Dynasty",
          zh: "阮朝",
          ja: "阮朝",
          ko: "응우옌 왕조",
        },
        groupId: "era",
      },
      {
        id: "bac",
        name: {
          vi: "Bắc thuộc",
          en: "Under Chinese rule",
          zh: "時北屬",
          ja: "時北屬",
          ko: "북에 속함",
        },
        groupId: "era",
      },
      {
        id: "phap",
        name: {
          vi: "Pháp thuộc",
          en: "Under French rule",
          zh: "時法國屬",
          ja: "時法國屬",
          ko: "프랑스 속함",
        },
        groupId: "era",
      },
    ],
  },
];

const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORY_GROUPS.flatMap((group) =>
    group.options.map((category) => [category.id, category]),
  ),
);

export function getCategoryNames(categories: string[], locale: Locale): string {
  return categories
    .map((id) => CATEGORY_MAP[id]?.name[locale] ?? "(?)")
    .join(", ");
}

export function getCategoryName(categoryId: string, locale: Locale): string {
  const category = CATEGORY_MAP[categoryId];

  return category?.name[locale] ?? "(?)";
}
