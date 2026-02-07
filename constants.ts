
import { CategoryGroup, HistoryPeriod } from './types';

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'religion',
    title: { vi: 'Phong tục & Tôn giáo', en: 'Customs & Religion', zh: '习俗 với 宗教', ja: '風習と宗教', ko: '풍습 및 종교' },
    options: [
      { id: 'p', name: { vi: 'Phật giáo', en: 'Buddhism', zh: '佛教', ja: '仏教', ko: '불교' }, groupId: 'religion' },
      { id: 'tg', name: { vi: 'Tôn giáo khác', en: 'Other religions', zh: '其他宗教', ja: 'その他の宗教', ko: '기타 종교' }, groupId: 'religion' },
      { id: 'pt', name: { vi: 'Phong tục', en: 'Customs', zh: '风俗', ja: '風習', ko: '풍습' }, groupId: 'religion' },
      { id: 'tn', name: { vi: 'Tín ngưỡng', en: 'Beliefs', zh: '信仰', ja: '信仰', ko: '신앙' }, groupId: 'religion' },
    ],
  },
  {
    id: 'genre',
    title: { vi: 'Thể loại', en: 'Genre', zh: '类型', ja: 'ジャンル', ko: '장르' },
    options: [
      { id: 'kt', name: { vi: 'Kiến trúc', en: 'Architecture', zh: '建筑', ja: '建築', ko: '건축' }, groupId: 'genre' },
      { id: 'tp', name: { vi: 'Trang phục', en: 'Clothing', zh: '服装', ja: '衣装', ko: '의상' }, groupId: 'genre' },
      { id: 'hv', name: { vi: 'Hoa văn', en: 'Patterns', zh: '图案', ja: '文様', ko: '문양' }, groupId: 'genre' },
      { id: 'vt', name: { vi: 'Văn thư', en: 'Records', zh: '文书', ja: '文書', ko: '문서' }, groupId: 'genre' },
      { id: 'qs', name: { vi: 'Quân sự', en: 'Military', zh: '军事', ja: '軍事', ko: '군사' }, groupId: 'genre' },
      { id: 'nc', name: { vi: 'Nhạc cụ', en: 'Musical instrument', zh: '乐器', ja: '楽器', ko: '악기' }, groupId: 'genre' },
      { id: 'dc', name: { vi: 'Dụng cụ', en: 'Utensils', zh: '器具', ja: '器具', ko: '기구' }, groupId: 'genre' },
      { id: 'dk', name: { vi: 'Điêu khắc', en: 'Sculpture', zh: '雕塑', ja: '彫刻', ko: '조각' }, groupId: 'genre' },
      { id: 'bvqg', name: { vi: 'Bảo vật quốc gia', en: 'National Treasure', zh: '国宝', ja: '国宝', ko: '국보' }, groupId: 'genre' },
      { id: 'dtqg', name: { vi: 'Di tích quốc gia', en: 'National site', zh: '国家古迹', ja: '国家指定史跡', ko: '국가 지정 문화재' }, groupId: 'genre' },
      { id: 'dtqgdb', name: { vi: 'Di tích quốc gia đặc biệt', en: 'Special national site', zh: '全国重点文物保护单位', ja: '特別史跡', ko: '국가지정문화재' }, groupId: 'genre' },
      { id: 'dstg', name: { vi: 'Di sản thế giới', en: 'World Heritage', zh: '世界遗产', ja: '世界遺産', ko: '세계 유산' }, groupId: 'genre' },
    ],
  },
  {
    id: 'era',
    title: { vi: 'Thời đại', en: 'Era', zh: '时代', ja: '時代', ko: '시대' },
    options: [
      { id: 'cd', name: { vi: 'Cổ đại', en: 'Antiquity', zh: '古代', ja: '古代', ko: '고대' }, groupId: 'era' },
      { id: 'cp', name: { vi: 'Champa', en: 'Champa', zh: '占婆', ja: 'チャンパ', ko: '참파' }, groupId: 'era' },
      { id: 'dl', name: { vi: 'Thời kỳ độc lập sau Bắc thuộc', en: 'Post-Chinese rule', zh: '越南独立时期', ja: '北属期後の独立時期', ko: '북속기 이후의 독립기' }, groupId: 'era' },
      { id: 'ly', name: { vi: 'Nhà Lý', en: 'Ly Dynasty', zh: '李朝', ja: '李朝', ko: '리 왕조' }, groupId: 'era' },
      { id: 'tran', name: { vi: 'Nhà Trần', en: 'Tran Dynasty', zh: '陈朝', ja: '陳朝', ko: '쩐 왕조' }, groupId: 'era' },
      { id: 'ho', name: { vi: 'Nhà Hồ', en: 'Ho Dynasty', zh: '胡朝', ja: '胡朝', ko: '호 왕조' }, groupId: 'era' },
      { id: 'le_so', name: { vi: 'Nhà Lê sơ', en: 'Early Le Dynasty', zh: '黎初朝', ja: '黎朝', ko: '레 왕조' }, groupId: 'era' },
      { id: 'mac', name: { vi: 'Nhà Mạc', en: 'Mac Dynasty', zh: '莫朝', ja: '莫朝', ko: '막 왕조' }, groupId: 'era' },
      { id: 'le_th', name: { vi: 'Nhà Lê trung hưng', en: 'Revival Le Dynasty', zh: '黎中興朝', ja: '黎中興朝', ko: '후기 레 왕조' }, groupId: 'era' },
      { id: 'tay_son', name: { vi: 'Nhà Tây sơn', en: 'Tayson Dynasty', zh: '西山朝', ja: '西山朝', ko: '떠이선 왕조' }, groupId: 'era' },
      { id: 'nguyen', name: { vi: 'Nhà Nguyễn', en: 'Nguyen Dynasty', zh: '阮朝', ja: '阮朝', ko: '응우옌 왕조' }, groupId: 'era' },
      { id: 'bac', name: { vi: 'Bắc thuộc', en: 'Under Chinese rule', zh: '時北屬', ja: '時北屬', ko: '북에 속함' }, groupId: 'era' },
      { id: 'phap', name: { vi: 'Pháp thuộc', en: 'Under French rule', zh: '時法國屬', ja: '時法國屬', ko: '프랑스 속함' }, groupId: 'era' },
    ],
  },
  {
    id: 'region',
    title: { vi: 'Khu vực', en: 'Region', zh: '地区', ja: '地域', ko: '지역' },
    options: [
      { id: 'm_bac', name: { vi: 'Miền Bắc', en: 'Northern Region', zh: '北部', ja: '北部', ko: '북부' }, groupId: 'region' },
      { id: 'm_trung', name: { vi: 'Miền Trung', en: 'Central Region', zh: '中部', ja: '中部', ko: '중부' }, groupId: 'region' },
      { id: 'm_nam', name: { vi: 'Miền Nam', en: 'Southern Region', zh: '南部', ja: '南部', ko: '남부' }, groupId: 'region' },
      { id: 'm_nui', name: { vi: 'Các dân tộc miền núi', en: 'Highland ethnicities', zh: '高地民族', ja: '山岳民族', ko: '산악 민족' }, groupId: 'region' },
      // Fixed: removed extra comma from the end of the line below
      { id: 'ngoai_quoc', name: { vi: 'Ngoại quốc', en: 'Foreign', zh: '外国', ja: '外国', ko: '외국' }, groupId: 'region' },
    ],
  },
];

export const HISTORY_DATA: HistoryPeriod[] = [
  {
    name: { vi: "Văn Lang", en: "Van Lang", zh: "文郎", ja: "バンラン", ko: "반랑" },
    start: "2524 TCN",
    end: "257 TCN",
    type: 'independence'
  },
  {
    name: { vi: "Âu Lạc", en: "Au Lac", zh: "瓯雒", ja: "アウラック", ko: "어울락" },
    start: "257 TCN",
    end: "179 TCN",
    type: 'independence'
  },
  {
    name: { vi: "Nhà Triệu", en: "Trieu Dynasty", zh: "赵朝", ja: "趙朝", ko: "조 왕조" },
    start: "208 TCN",
    end: "111 TCN",
    type: 'independence'
  },
  {
    name: { vi: "Bắc thuộc lần I", en: "First Chinese Domination", zh: "第一次北属", ja: "第一次北属期", ko: "제1차 북속기" },
    start: "111 TCN",
    end: "40",
    type: 'occupation'
  },
  {
    name: { vi: "Hai Bà Trưng", en: "Trung Sisters", zh: "二征夫人", ja: "하이・バー・チュン", ko: "하이 바 쯩" },
    start: "40",
    end: "43",
    type: 'independence'
  },
  {
    name: { vi: "Bắc thuộc lần II", en: "Second Chinese Domination", zh: "第二次北属", ja: "第二次北属期", ko: "제2차 북속기" },
    start: "43",
    end: "544",
    type: 'occupation'
  },
  {
    name: { vi: "Nhà (Tiền) Lý", en: "Early Ly Dynasty", zh: "前李朝", ja: "前李朝", ko: "전 리 왕조" },
    start: "544",
    end: "602",
    type: 'independence'
  },
  {
    name: { vi: "Bắc thuộc lần III", en: "Third Chinese Domination", zh: "第三次北属", ja: "第三次北属期", ko: "제3차 북속기" },
    start: "602",
    end: "939",
    type: 'occupation'
  },
  {
    name: { vi: "Nhà Ngô", en: "Ngo Dynasty", zh: "吴朝", ja: "呉朝", ko: "응오 왕조" },
    start: "939",
    end: "965",
    type: 'independence'
  },
  {
    name: { vi: "Loạn 12 sứ quân", en: "Anarchy of the 12 Warlords", zh: "十二使君之亂", ja: "十二使君의 란", ko: "십이사군의 난" },
    start: "966",
    end: "980",
    type: 'war'
  },
  {
    name: { vi: "Nhà Đinh", en: "Dinh Dynasty", zh: "丁朝", ja: "丁朝", ko: "딘 왕조" },
    start: "968",
    end: "980",
    type: 'independence'
  },
  {
    name: { vi: "Kháng chiến chống Tống I", en: "First resistance war against the Song", zh: "第一次宋越战争", ja: "第一次宋越戦争", ko: "제1차 송-대월 전쟁" },
    start: "981",
    end: "981",
    type: 'war'
  },
  {
    name: { vi: "Nhà (Tiền) Lê", en: "Early Le Dynasty", zh: "前黎朝", ja: "前黎朝", ko: "전 레 왕조" },
    start: "980",
    end: "1009",
    type: 'independence'
  },
  {
    name: { vi: "Nhà Lý", en: "Ly Dynasty", zh: "李朝", ja: "李朝", ko: "리 왕조" },
    start: "1009",
    end: "1225",
    type: 'independence'
  },
  {
    name: { vi: "Kháng chiến chống Tống II", en: "Second resistance war against the Song", zh: "第二次宋越战争", ja: "第二次宋越戦争", ko: "제2차 송-대월 전쟁" },
    start: "1075",
    end: "1077",
    type: 'war'
  },
  {
    name: { vi: "Nhà Trần", en: "Tran Dynasty", zh: "陈朝", ja: "陳朝", ko: "쩐 왕조" },
    start: "1226",
    end: "1400",
    type: 'independence'
  },
  {
    name: { vi: "Kháng chiến chống Mông - Nguyên I", en: "First resistance war against the Mongol and Yuan", zh: "第一次蒙越战争", ja: "第一次元越戦争", ko: "제1차 대월-몽골 전쟁" },
    start: "1257",
    end: "1258",
    type: 'war'
  },
  {
    name: { vi: "Kháng chiến chống Mông - Nguyên II", en: "Second resistance war against the Mongol and Yuan", zh: "第二次蒙越战争", ja: "第二次元越戦争", ko: "제2차 대월-몽골 전쟁" },
    start: "1284",
    end: "1285",
    type: 'war'
  },
  {
    name: { vi: "Kháng chiến chống Mông - Nguyên III", en: "Third resistance war against the Mongol and Yuan", zh: "第三次蒙越战争", ja: "第三次元越戦争", ko: "제3차 대월-몽골 전쟁" },
    start: "1287",
    end: "1288",
    type: 'war'
  },
  {
    name: { vi: "Nhà Hồ", en: "Ho Dynasty", zh: "胡朝", ja: "胡朝", ko: "호 왕조" },
    start: "1400",
    end: "1407",
    type: 'independence'
  },
  {
    name: { vi: "Bắc thuộc lần IV", en: "Fourth Chinese Domination", zh: "第四次北属", ja: "第四次北属期", ko: "제4차 북속기" },
    start: "1407",
    end: "1427",
    type: 'occupation'
  },
  {
    name: { vi: "Khởi nghĩa Lam Sơn", en: "Lam Sơn uprising", zh: "蓝山起义", ja: "藍山蜂起", ko: "람선 봉기" },
    start: "1418",
    end: "1427",
    type: 'occupation'
  },
  {
    name: { vi: "Nhà Lê (sơ)", en: "Early Later Le Dynasty", zh: "黎初朝", ja: "黎初朝", ko: "레 왕조 (초기)" },
    start: "1428",
    end: "1527",
    type: 'independence'
  },
  {
    name: { vi: "Nhà Mạc", en: "Mac Dynasty", zh: "莫朝", ja: "莫朝", ko: "막 왕조" },
    start: "1527",
    end: "1593",
    type: 'independence'
  },
  {
    name: { vi: "Nam - Bắc triều", en: "Northern and Southern dynasties", zh: "南北朝", ja: "南北朝", ko: "남북조 시대" },
    start: "1533",
    end: "1593",
    type: 'war'
  },
  {
    name: { vi: "Nhà Lê (trung hưng) - Đàng Ngoài", en: "Restored Le Dynasty - Outer Realm", zh: "黎中兴朝 - 北河", ja: "黎中興朝 - 北河", ko: "레 왕조 (중흥) - 당 응아이" },
    start: "1533",
    end: "1787",
    type: 'independence'
  },
  {
    name: { vi: "Đàng Trong", en: "Inner Realm (Nguyen Lords)", zh: "南河 (阮主)", ja: "広南国 (阮主)", ko: "당 쫑 (응우옌 주)" },
    start: "1600",
    end: "1777",
    type: 'independence'
  },
  {
    name: { vi: "Kháng chiến chống Thanh", en: "Resistance War against the Qing", zh: "清越战争", ja: "清越戦争", ko: "청-베트남 전쟁" },
    start: "1789",
    end: "1789",
    type: 'war'
  },
  {
    name: { vi: "Kháng chiến chống Xiêm", en: "Resistance war against the Siamese", zh: "暹越战争", ja: "暹越戦争", ko: "시암-베트남 전쟁" },
    start: "1785",
    end: "1785",
    type: 'war'
  },
  {
    name: { vi: "Nhà Tây Sơn", en: "Tay Son Dynasty", zh: "西山朝", ja: "西山朝", ko: "떠이선 왕조" },
    start: "1778",
    end: "1802",
    type: 'independence'
  },
  {
    name: { vi: "Nhà Nguyễn", en: "Nguyen Dynasty", zh: "阮朝", ja: "阮朝", ko: "응우옌 왕조" },
    start: "1802",
    end: "1945",
    type: 'independence'
  },
  {
    name: { vi: "Pháp thuộc", en: "French Protectorate", zh: "法属时期", ja: "フランス植民地時代", ko: "프랑스 식민지 시대" },
    start: "1858",
    end: "1945",
    type: 'occupation'
  },
  {
    name: { vi: "Việt Nam Dân chủ Cộng hòa", en: "Democratic Republic of Vietnam", zh: "越南民主共和国", ja: "베트남民主共和国", ko: "베트남 민주 공화국" },
    start: "1945",
    end: "1976",
    type: 'independence'
  },
  {
    name: { vi: "Kháng chiến chống Pháp", en: "Resistance War against the French", zh: "抗法战争", ja: "抗仏戦争", ko: "항프 전쟁" },
    start: "1946",
    end: "1954",
    type: 'war'
  },
  {
    name: { vi: "Kháng chiến chống Mỹ", en: "Resistance War against the Americans", zh: "抗美战争", ja: "ベトナム戦争", ko: "베트남 전쟁" },
    start: "1954",
    end: "1975",
    type: 'war'
  },
  {
    name: { vi: "Chiến tranh biên giới Tây Nam", en: "Cambodian - Vietnamese War", zh: "柬越戰爭", ja: "カンボジア・ベトナム戦争", ko: "베트남-캄보디아 전쟁" },
    start: "1978",
    end: "1989",
    type: 'war'
  },
  {
    name: { vi: "Chiến tranh biên giới", en: "Sino - Vietnamese War", zh: "中越战争", ja: "中越戦争", ko: "중국-베트남 전쟁" },
    start: "1979",
    end: "1979",
    type: 'war'
  },
  {
    name: { vi: "Cộng hòa Xã hội chủ nghĩa Việt Nam", en: "Socialist Republic of Vietnam", zh: "越南社会主义共和国", ja: "베트남社会主義共和国", ko: "베트남 사회주의 공화국" },
    start: "1975",
    end: "nay",
    type: 'independence'
  },
];
