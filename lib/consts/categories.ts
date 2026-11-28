import type { Locale } from "@/lib/lang";

export interface Category {
  /** Numeric id — matches public.categories.id in Supabase */
  id: number;
  /** Legacy short code from the Google Sheet era (kept so old links still work) */
  code: string;
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
      fr: "Coutumes & Religions",
      zh: "习俗 & 宗教",
      ja: "風習と宗教",
      ko: "풍습 및 종교",
    },
    options: [
      {
        id: 1,
        code: "pg",
        name: {
          vi: "Phật giáo",
          en: "Buddhism",
          fr: "Bouddhisme",
          zh: "佛教",
          ja: "仏教",
          ko: "불교",
        },
        groupId: "religion",
      },
      {
        id: 2,
        code: "tg",
        name: {
          vi: "Tôn giáo khác",
          en: "Other religions",
          fr: "Autres religions",
          zh: "其他宗教",
          ja: "その他の宗教",
          ko: "기타 종교",
        },
        groupId: "religion",
      },
      {
        id: 3,
        code: "pt",
        name: {
          vi: "Phong tục",
          en: "Customs",
          fr: "Coutumes",
          zh: "风俗",
          ja: "風習",
          ko: "풍습",
        },
        groupId: "religion",
      },
      {
        id: 4,
        code: "tn",
        name: {
          vi: "Tín ngưỡng",
          en: "Beliefs",
          fr: "Croyances",
          zh: "信仰",
          ja: "信仰",
          ko: "신앙",
        },
        groupId: "religion",
      },
      {
        id: 5,
        code: "nv",
        name: {
          vi: "Nhân vật",
          en: "Characters",
          fr: "Personnages",
          zh: "人物",
          ja: "人物",
          ko: "인물",
        },
        groupId: "religion",
      },
      {
        id: 6,
        code: "lv",
        name: {
          vi: "Linh vật",
          en: "Mythical Creatures",
          fr: "Créatures mythiques",
          zh: "神兽",
          ja: "霊獣",
          ko: "영물",
        },
        groupId: "religion",
      },
      {
        id: 7,
        code: "tt",
        name: {
          vi: "Thần thánh",
          en: "Deities",
          fr: "Divinités",
          zh: "神",
          ja: "神々",
          ko: "신",
        },
        groupId: "religion",
      },
      {
        id: 8,
        code: "mq",
        name: {
          vi: "Ma quỷ",
          en: "Demons & Ghosts",
          fr: "Démons & Esprits",
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
    title: {
      vi: "Khu vực",
      en: "Region",
      fr: "Région",
      zh: "地区",
      ja: "地域",
      ko: "지역",
    },
    options: [
      {
        id: 9,
        code: "mbac",
        name: {
          vi: "Miền Bắc",
          en: "Northern region",
          fr: "Région du Nord",
          zh: "北部",
          ja: "北部",
          ko: "북부",
        },
        groupId: "region",
      },
      {
        id: 10,
        code: "mtrung",
        name: {
          vi: "Miền Trung",
          en: "Central region",
          fr: "Région du Centre",
          zh: "中部",
          ja: "中部",
          ko: "중부",
        },
        groupId: "region",
      },
      {
        id: 11,
        code: "mnam",
        name: {
          vi: "Miền Nam",
          en: "Southern region",
          fr: "Région du Sud",
          zh: "南部",
          ja: "南部",
          ko: "남부",
        },
        groupId: "region",
      },
      {
        id: 12,
        code: "mnui",
        name: {
          vi: "Các dân tộc miền núi",
          en: "Highland ethnicities",
          fr: "Ethnies montagnardes",
          zh: "高地民族",
          ja: "山岳民族",
          ko: "산악 민족",
        },
        groupId: "region",
      },
      {
        id: 13,
        code: "nq",
        name: {
          vi: "Ngoại quốc",
          en: "Foreign",
          fr: "Étranger",
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
      fr: "Genre",
      zh: "类型",
      ja: "ジャンル",
      ko: "장르",
    },
    options: [
      {
        id: 14,
        code: "kt",
        name: {
          vi: "Kiến trúc",
          en: "Architecture",
          fr: "Architecture",
          zh: "建筑",
          ja: "建築",
          ko: "건축",
        },
        groupId: "genre",
      },
      {
        id: 15,
        code: "tp",
        name: {
          vi: "Trang phục",
          en: "Clothing",
          fr: "Costumes",
          zh: "服装",
          ja: "衣装",
          ko: "의상",
        },
        groupId: "genre",
      },
      {
        id: 16,
        code: "hv",
        name: {
          vi: "Hoa văn",
          en: "Patterns",
          fr: "Motifs",
          zh: "图案",
          ja: "文様",
          ko: "문양",
        },
        groupId: "genre",
      },
      {
        id: 17,
        code: "vt",
        name: {
          vi: "Văn thư",
          en: "Records",
          fr: "Écrits & Archives",
          zh: "文书",
          ja: "文書",
          ko: "문서",
        },
        groupId: "genre",
      },
      {
        id: 18,
        code: "qs",
        name: {
          vi: "Quân sự",
          en: "Military",
          fr: "Militaire",
          zh: "军事",
          ja: "軍事",
          ko: "군사",
        },
        groupId: "genre",
      },
      {
        id: 19,
        code: "an",
        name: {
          vi: "Âm nhạc",
          en: "Music",
          fr: "Musique",
          zh: "音乐",
          ja: "音楽",
          ko: "음악",
        },
        groupId: "genre",
      },
      {
        id: 20,
        code: "dc",
        name: {
          vi: "Dụng cụ",
          en: "Utensils",
          fr: "Ustensiles",
          zh: "器具",
          ja: "器具",
          ko: "기구",
        },
        groupId: "genre",
      },
      {
        id: 21,
        code: "dk",
        name: {
          vi: "Điêu khắc",
          en: "Sculpture",
          fr: "Sculpture",
          zh: "雕塑",
          ja: "彫刻",
          ko: "조각",
        },
        groupId: "genre",
      },
      {
        id: 22,
        code: "bvqg",
        name: {
          vi: "Bảo vật quốc gia",
          en: "National treasure",
          fr: "Trésor national",
          zh: "国宝",
          ja: "国宝",
          ko: "국보",
        },
        groupId: "genre",
      },
      {
        id: 23,
        code: "dtqg",
        name: {
          vi: "Di tích quốc gia",
          en: "National site",
          fr: "Monument national",
          zh: "国家古迹",
          ja: "国家指定史跡",
          ko: "국가 지정 문화재",
        },
        groupId: "genre",
      },
      {
        id: 24,
        code: "dtqgdb",
        name: {
          vi: "Di tích quốc gia đặc biệt",
          en: "Special national site",
          fr: "Monument national spécial",
          zh: "全国重点文物保护单位",
          ja: "特別史跡",
          ko: "국가지정문화재",
        },
        groupId: "genre",
      },
      {
        id: 25,
        code: "dstg",
        name: {
          vi: "Di sản thế giới",
          en: "World heritage",
          fr: "Patrimoine mondial",
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
    title: {
      vi: "Thời đại",
      en: "Era",
      fr: "Époque",
      zh: "时代",
      ja: "時代",
      ko: "시대",
    },
    options: [
      {
        id: 26,
        code: "cd",
        name: {
          vi: "Cổ đại",
          en: "Antiquity",
          fr: "Antiquité",
          zh: "古代",
          ja: "古代",
          ko: "고대",
        },
        groupId: "era",
      },
      {
        id: 27,
        code: "champa",
        name: {
          vi: "Champa",
          en: "Champa",
          fr: "Champa",
          zh: "占婆",
          ja: "チャンパ",
          ko: "참파",
        },
        groupId: "era",
      },
      {
        id: 28,
        code: "dl",
        name: {
          vi: "Thời kỳ độc lập sau Bắc thuộc",
          en: "Post-Chinese rule",
          fr: "Période d'indépendance",
          zh: "越南独立时期",
          ja: "北属期後の独立時期",
          ko: "북속기 이후의 독립기",
        },
        groupId: "era",
      },
      {
        id: 29,
        code: "ly",
        name: {
          vi: "Nhà Lý",
          en: "Lý Dynasty",
          fr: "Dynastie des Lý",
          zh: "李朝",
          ja: "李朝",
          ko: "리 왕조",
        },
        groupId: "era",
      },
      {
        id: 30,
        code: "tran",
        name: {
          vi: "Nhà Trần",
          en: "Trần Dynasty",
          fr: "Dynastie des Trần",
          zh: "陈朝",
          ja: "陳朝",
          ko: "쩐 왕조",
        },
        groupId: "era",
      },
      {
        id: 31,
        code: "ho",
        name: {
          vi: "Nhà Hồ",
          en: "Hồ Dynasty",
          fr: "Dynastie des Hồ",
          zh: "胡朝",
          ja: "胡朝",
          ko: "호 왕조",
        },
        groupId: "era",
      },
      {
        id: 32,
        code: "leso",
        name: {
          vi: "Nhà Lê sơ",
          en: "Early Lê Dynasty",
          fr: "Dynastie des Lê postérieurs (Lê sơ)",
          zh: "黎初朝",
          ja: "黎朝",
          ko: "레 왕조",
        },
        groupId: "era",
      },
      {
        id: 33,
        code: "mac",
        name: {
          vi: "Nhà Mạc",
          en: "Mạc Dynasty",
          fr: "Dynastie des Mạc",
          zh: "莫朝",
          ja: "莫朝",
          ko: "막 왕조",
        },
        groupId: "era",
      },
      {
        id: 34,
        code: "leth",
        name: {
          vi: "Nhà Lê trung hưng",
          en: "Revival Lê Dynasty",
          fr: "Dynastie des Lê restaurés (Lê trung hưng)",
          zh: "黎中興朝",
          ja: "黎中興朝",
          ko: "후기 레 왕조",
        },
        groupId: "era",
      },
      {
        id: 35,
        code: "ts",
        name: {
          vi: "Nhà Tây sơn",
          en: "Tây-sơn Dynasty",
          fr: "Dynastie des Tây Sơn",
          zh: "西山朝",
          ja: "西山朝",
          ko: "떠이선 왕조",
        },
        groupId: "era",
      },
      {
        id: 36,
        code: "nguyen",
        name: {
          vi: "Nhà Nguyễn",
          en: "Nguyễn Dynasty",
          fr: "Dynastie des Nguyễn",
          zh: "阮朝",
          ja: "阮朝",
          ko: "응우옌 왕조",
        },
        groupId: "era",
      },
      {
        id: 37,
        code: "bac",
        name: {
          vi: "Bắc thuộc",
          en: "Under Chinese rule",
          fr: "Domination chinoise",
          zh: "時北屬",
          ja: "時北屬",
          ko: "북에 속함",
        },
        groupId: "era",
      },
      {
        id: 38,
        code: "phap",
        name: {
          vi: "Pháp thuộc",
          en: "Under French rule",
          fr: "Période coloniale française",
          zh: "時法國屬",
          ja: "時法國屬",
          ko: "프랑스 속함",
        },
        groupId: "era",
      },
    ],
  },
];

export const ALL_CATEGORIES: Category[] = CATEGORY_GROUPS.flatMap(
  (group) => group.options,
);

const CATEGORY_MAP: Map<number, Category> = new Map(
  ALL_CATEGORIES.map((category) => [category.id, category]),
);

const CATEGORY_ID_BY_CODE: Map<string, number> = new Map(
  ALL_CATEGORIES.map((category) => [category.code, category.id]),
);

/** Category ids used by code that needs a specific category. */
export const CATEGORY_ID = Object.fromEntries(
  ALL_CATEGORIES.map((category) => [category.code, category.id]),
) as Record<string, number>;

/**
 * Parses a category from a URL / API parameter. Accepts the numeric id ("14")
 * and, for backward compatibility, the legacy code ("kt").
 */
export function parseCategoryParam(value: string): number | undefined {
  const v = value.trim();
  if (!v) return undefined;
  if (/^\d+$/.test(v)) {
    const id = Number(v);
    return CATEGORY_MAP.has(id) ? id : undefined;
  }
  return CATEGORY_ID_BY_CODE.get(v.toLowerCase());
}

export function parseCategoryParams(values: string[]): number[] {
  const ids: number[] = [];
  for (const raw of values) {
    for (const part of raw.split(",")) {
      const id = parseCategoryParam(part);
      if (id !== undefined && !ids.includes(id)) ids.push(id);
    }
  }
  return ids;
}

export function getCategory(categoryId: number): Category | undefined {
  return CATEGORY_MAP.get(categoryId);
}

export function getCategoryNames(categories: number[], locale: Locale) {
  return (categories || [])
    .map((id) => getCategoryName(id, locale))
    .filter(Boolean)
    .join(", ");
}

export function getCategoryName(categoryId: number, locale: Locale) {
  const category = CATEGORY_MAP.get(categoryId);
  return (
    category?.name[locale] ??
    category?.name.en ??
    category?.name.vi ??
    undefined
  );
}
