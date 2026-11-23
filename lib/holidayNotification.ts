import { convertSolar2Lunar } from "./lunarConverter";
import type { Locale } from "./lang";

export interface HolidayInfo {
  id: string;
  message: string;
  directUrl?: string;
}

export function calculateToastDuration(message: string, locale: Locale): number {
  if (!message) return 5000;
  let wordCount = 0;
  if (locale === "zh" || locale === "ja") {
    // For CJK languages, 1 character roughly equates to 0.5 - 0.7 words, or count ideographs / 2
    const chars = message.replace(/\s+/g, "").length;
    wordCount = Math.max(1, Math.round(chars / 2));
  } else {
    wordCount = message.trim().split(/\s+/).filter(Boolean).length;
  }
  // Cứ mỗi 2 từ thì hiển thị 1s (1000ms). Thời gian tối thiểu 4s.
  const seconds = Math.max(4, Math.ceil(wordCount / 2));
  return seconds * 1000;
}

export function checkHoliday(date: Date, locale: Locale): HolidayInfo | null {
  const solarDay = date.getDate();
  const solarMonth = date.getMonth() + 1; // 1-12
  const solarYear = date.getFullYear();

  const lunar = convertSolar2Lunar(solarDay, solarMonth, solarYear);
  const lunarDay = lunar.day;
  const lunarMonth = lunar.month;

  // 1. 23/12 - 3/1 Âm lịch: Chào mừng Tết Nguyên Đán
  const isTet =
    (lunarMonth === 12 && lunarDay >= 23) ||
    (lunarMonth === 1 && lunarDay <= 3);

  if (isTet) {
    const tetYear = lunarMonth === 12 ? solarYear + 1 : solarYear;
    const messages: Record<Locale, string> = {
      vi: `Chào mừng Tết Nguyên Đán ${tetYear}`,
      en: `Happy Lunar New Year ${tetYear}`,
      fr: `Joyeux Nouvel An Lunaire ${tetYear}`,
      zh: `欢度${tetYear}年农历新年`,
      ja: `${tetYear}年の旧正月を祝して`,
      ko: `${tetYear}년 설날을 축하합니다`,
    };
    return {
      id: `tet_${tetYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?query=Tết+Nguyên+đán`,
    };
  }

  // 2. 8/3 - 10/3 Âm lịch: Giỗ tổ Hùng Vương
  if (lunarMonth === 3 && lunarDay >= 8 && lunarDay <= 10) {
    const messages: Record<Locale, string> = {
      vi: "Chào mừng ngày Giỗ tổ Hùng Vương (10/3)",
      en: "Commemorating the Hung Kings Memorial Day (10/3 Lunar)",
      fr: "Commémoration du jour de commémoration des rois Hùng (10/3 lunaire)",
      zh: "纪念雄王节（农历三月初十）",
      ja: "フン王の命日を記念して（旧暦3月10日）",
      ko: "훙왕 기일 기념 (음력 3월 10일)",
    };
    return {
      id: `hung_kings_${solarYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?cats=cd`,
    };
  }

  // 3. 14/8 - 15/8 Âm lịch: Tết Trung Thu
  if (lunarMonth === 8 && (lunarDay === 14 || lunarDay === 15)) {
    const messages: Record<Locale, string> = {
      vi: "Chào mừng ngày Tết Trung thu (15/8)",
      en: "Happy Mid-Autumn Festival (15/8 Lunar)",
      fr: "Joyeuse Fête de la Mi-Automne (15/8 lunaire)",
      zh: "欢度中秋节（农历八月十五）",
      ja: "中秋節を祝して（旧暦8月15日）",
      ko: "즐거운 추석 보내세요 (음력 8월 15일)",
    };
    return {
      id: `mid_autumn_${solarYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?query=Tết+Trung+thu`,
    };
  }

  // --- CÁC SỰ KIỆN DƯƠNG LỊCH BỔ SUNG & CỐ ĐỊNH ---

  // 4. Ngày 9-10 tháng 1 (DL):
  // "Tháng 1 năm 1226, Lý Chiêu Hoàng nhường ngôi cho Trần Cảnh, Trần Cảnh lên ngôi Hoàng đế, miếu hiệu là Thái tông, lập ra nhà Trần"
  if (solarMonth === 1 && (solarDay === 9 || solarDay === 10)) {
    const messages: Record<Locale, string> = {
      vi: "Tháng 1 năm 1226, Lý Chiêu Hoàng nhường ngôi cho Trần Cảnh, Trần Cảnh lên ngôi Hoàng đế, miếu hiệu là Thái tông, lập ra nhà Trần",
      en: "In January 1226, Empress Ly Chieu Hoang abdicated in favor of Tran Canh (Emperor Tran Thai Tong), founding the Tran Dynasty",
      fr: "En janvier 1226, l'impératrice Lý Chiêu Hoàng abdique en faveur de Trần Cảnh (empereur Trần Thái Tông), fondant la dynastie Trần",
      zh: "1226年1月，李昭皇禅位于陈煚，陈煚称帝，庙号太宗，开创陈朝",
      ja: "1226年1月、李昭皇が陳煚（太宗皇帝）に譲位し、陳朝が建国されました",
      ko: "1226년 1월, 리찌에우호앙 여황이 쩐까인(태종)에게 선위하여 쩐 왕조를 개창했습니다",
    };
    return {
      id: `tran_dynasty_${solarYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?cats=tran`,
    };
  }

  // 5. Ngày 1-2 tháng 2 (DL):
  // "Tháng 2 năm 40, Hai Bà Trưng khởi nghĩa chống lại nhà Hán đô hộ nước ta. Đến năm 43, khởi nghĩa thất bại, nhưng tinh thần hai bà thì vẫn còn mãi"
  if (solarMonth === 2 && (solarDay === 1 || solarDay === 2)) {
    const messages: Record<Locale, string> = {
      vi: "Tháng 2 năm 40, Hai Bà Trưng khởi nghĩa chống lại nhà Hán đô hộ nước ta. Đến năm 43, khởi nghĩa thất bại, nhưng tinh thần hai bà thì vẫn còn mãi",
      en: "In February 40 AD, the Trung Sisters led an uprising against Han domination. The revolt ended in 43 AD, but their heroic spirit lives on forever",
      fr: "En février 40 ap. J.-C., les sœurs Trưng se soulevèrent contre la domination des Han. La révolte prit fin en 43, mais leur esprit héroïque demeure à jamais",
      zh: "公元40年2月，二征夫人发动反抗东汉统治的起义。虽于公元43年失败，但二位夫人的不屈气节永存",
      ja: "西暦40年2月、ハイ・バー・チュン（チュン姉妹）が後漢の支配に抗して蜂起しました。43年に敗れるも、その精神は永遠に語り継がれています",
      ko: "서기 40년 2월, 쯩 자매가 한나라의 지배에 맞서 봉기했습니다. 서기 43년에 패하였으나 그 숭고한 정신은 영원히 남아있습니다",
    };
    return {
      id: `hai_ba_trung_${solarYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?cats=bac`,
    };
  }

  // 6. Ngày 21 tháng 3 (DL):
  // "Năm 967, Đinh Bộ Lĩnh dẹp loạn 12 sứ quân. Năm 968 ông lên ngôi Hoàng đế, lập ra nhà Đinh, thụy là Tiên hoàng"
  if (solarMonth === 3 && solarDay === 21) {
    const messages: Record<Locale, string> = {
      vi: "Năm 967, Đinh Bộ Lĩnh dẹp loạn 12 sứ quân. Năm 968 ông lên ngôi Hoàng đế, lập ra nhà Đinh, thụy là Tiên hoàng",
      en: "In 967, Dinh Bo Linh quelled the 12 Warlords rebellion. In 968, he proclaimed himself Emperor, founding the Dinh Dynasty as Dinh Tien Hoang",
      fr: "En 967, Đinh Bộ Lĩnh pacifie la rébellion des 12 seigneurs de guerre. En 968, il monte sur le trône comme Empereur, fondant la dynastie Đinh sous le nom de Đinh Tiên Hoàng",
      zh: "967年，丁部领平定十二使君之乱。968年即皇帝位，开创丁朝，尊称丁先皇",
      ja: "967年、ディン・ボ・リンが十二使君の乱を平定。968年に皇帝に即位し、丁朝を開いて丁先皇と称しました",
      ko: "967년 딘보린이 12사군의 난을 평정하고, 968년 황제에 즉위하여 딘 왕조를 창건하고 딘선황이라 칭했습니다",
    };
    return {
      id: `dinh_dynasty_${solarYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?query=Đinh+Bộ+Lĩnh&cats=dl`,
    };
  }

  // 7. Ngày 22 tháng 3 (DL):
  // "Tháng 3 năm 1400, Trần Thiếu đế nhường ngôi cho Lê Quý Ly, lập ra nhà Hồ"
  if (solarMonth === 3 && solarDay === 22) {
    const messages: Record<Locale, string> = {
      vi: "Tháng 3 năm 1400, Trần Thiếu đế nhường ngôi cho Lê Quý Ly, lập ra nhà Hồ",
      en: "In March 1400, Emperor Tran Thieu De abdicated in favor of Le Quy Ly (Ho Quy Ly), founding the Ho Dynasty",
      fr: "En mars 1400, l'empereur Trần Thiếu đế abdique en faveur de Lê Quý Ly, fondant la dynastie Hồ",
      zh: "1400年3月，陈少帝禅位于黎季犛（胡季犛），建立胡朝",
      ja: "1400年3月、陳少帝が黎季犛（胡季犛）に譲位し、胡朝が成立しました",
      ko: "1400년 3월, 쩐 티에우제가 레꾸이리(호꾸이리)에게 선위하여 호 왕조를 개창했습니다",
    };
    return {
      id: `ho_dynasty_${solarYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?cats=ho`,
    };
  }

  // 8. Ngày 28-29 tháng 4 (DL):
  // "Năm 1418, Lê Lợi khởi nghĩa chống lại quân Minh xâm lược, đến tháng 4 năm 1428 thì lên ngôi Hoàng đế, lập ra nhà Lê (sơ), miếu hiệu là Thái tổ"
  if (solarMonth === 4 && (solarDay === 28 || solarDay === 29)) {
    const messages: Record<Locale, string> = {
      vi: "Năm 1418, Lê Lợi khởi nghĩa chống lại quân Minh xâm lược, đến tháng 4 năm 1428 thì lên ngôi Hoàng đế, lập ra nhà Lê (sơ), miếu hiệu là Thái tổ",
      en: "In 1418, Le Loi launched the Lam Son uprising against the Ming invaders; in April 1428, he ascended the throne as Emperor Le Thai To, establishing the Early Le Dynasty",
      fr: "En 1418, Lê Lợi lance l'insurrection de Lam Sơn contre les envahisseurs Ming; en avril 1428, il monte sur le trône sous le nom de Lê Thái Tổ, fondant la dynastie des Lê postérieurs",
      zh: "1418年，黎利发动蓝山起义反抗明朝侵略；1428年4月登基称帝，庙号太祖，建立后黎朝（前期）",
      ja: "1418年、レ・ロイが明の侵略に対抗して藍山蜂起を起こし、1428年4月に皇帝（黎太祖）に即位して前期黎朝を開きました",
      ko: "1418년 레러이가 명나라 침략군에 맞서 람선 봉기를 일으켰고, 1428년 4월 황제(태조)에 즉위하여 전기 레 왕조를 개창했습니다",
    };
    return {
      id: `le_so_dynasty_${solarYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?cats=leso`,
    };
  }

  // 9. 28/4 - 30/4 Dương lịch: Giải phóng miền Nam (giữ nguyên sự kiện kỷ niệm ngày 30/4)
  if (solarMonth === 4 && solarDay === 30) {
    const yearsSince1975 = solarYear - 1975;
    const messages: Record<Locale, string> = {
      vi: `Chào mừng ngày Giải phóng miền Nam, thống nhất đất nước 30/4/1975 - 30/4/${solarYear} (${yearsSince1975} năm)`,
      en: `Celebrating Liberation Day and National Reunification 30/4/1975 - 30/4/${solarYear} (${yearsSince1975} years)`,
      fr: `Célébration de la Journée de la Libération et de la Réunification Nationale 30/4/1975 - 30/4/${solarYear} (${yearsSince1975} ans)`,
      zh: `热烈庆祝南方解放与国家统一日 30/4/1975 - 30/4/${solarYear}（${yearsSince1975}周年）`,
      ja: `南部解放・国家統一記念日を祝して 1975年4月30日 - ${solarYear}年4月30日（${yearsSince1975}周年）`,
      ko: `남부 해방 및 조국 통일의 날 기념 1975년 4월 30일 - ${solarYear}년 4월 30일 (${yearsSince1975}주년)`,
    };
    return {
      id: `liberation_day_${solarYear}`,
      message: messages[locale] || messages.vi,
    };
  }

  // 10. 31/5 - 1/6 (DL):
  // "Tháng 6 năm 1802, Nguyễn Phúc Ánh lên ngôi Hoàng đế, lập ra nhà Nguyễn, miếu hiệu là Thế tổ"
  if ((solarMonth === 5 && solarDay === 31) || (solarMonth === 6 && solarDay === 1)) {
    const messages: Record<Locale, string> = {
      vi: "Tháng 6 năm 1802, Nguyễn Phúc Ánh lên ngôi Hoàng đế, lập ra nhà Nguyễn, miếu hiệu là Thế tổ",
      en: "In June 1802, Nguyen Phuc Anh ascended the throne as Emperor Gia Long (The To), founding the Nguyen Dynasty",
      fr: "En juin 1802, Nguyễn Phúc Ánh monte sur le trône sous le nom de Thế Tổ (Gia Long), fondant la dynastie Nguyễn",
      zh: "1802年6月，阮福映登基称帝，庙号世祖（嘉隆帝），建立阮朝",
      ja: "1802年6月、阮福映が皇帝（嘉隆帝・世祖）に即位し、阮朝が建国されました",
      ko: "1802년 6월, 응우옌 푹 아인이 황제(세조 가륭제)로 즉위하여 응우옌 왕조를 개창했습니다",
    };
    return {
      id: `nguyen_dynasty_${solarYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?cats=nguyen`,
    };
  }

  // 11. Ngày 14-15 tháng 6 (DL):
  // "Tháng 6 năm 1527, Lê Cung hoàng nhường ngôi cho Mạc Đăng Dung, lập ra nhà Mạc, miếu hiệu là Thái tổ"
  if (solarMonth === 6 && (solarDay === 14 || solarDay === 15)) {
    const messages: Record<Locale, string> = {
      vi: "Tháng 6 năm 1527, Lê Cung hoàng nhường ngôi cho Mạc Đăng Dung, lập ra nhà Mạc, miếu hiệu là Thái tổ",
      en: "In June 1527, Emperor Le Cung Hoang abdicated in favor of Mac Dang Dung (Mac Thai To), establishing the Mac Dynasty",
      fr: "En juin 1527, l'empereur Lê Cung Hoàng abdique en faveur de Mạc Đăng Dung (Mạc Thái Tổ), fondant la dynastie Mạc",
      zh: "1527年6月，黎恭皇禅位于莫登庸（莫太祖），建立莫朝",
      ja: "1527年6月、黎恭皇が莫登庸（莫太祖）に譲位し、莫朝が成立しました",
      ko: "1527년 6월, 레 궁황이 막당융(막 태조)에게 선위하여 막 왕조를 개창했습니다",
    };
    return {
      id: `mac_dynasty_${solarYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?cats=mac`,
    };
  }

  // 12. Ngày 1-2 tháng 8 (DL):
  // "Tháng 8 năm 980, Lê Hoàn lên ngôi hoàng đế, thụy là Đại hành hoàng đế, lập ra nhà (Tiền) Lê, đánh bại quân Tống xâm lược"
  if (solarMonth === 8 && (solarDay === 1 || solarDay === 2)) {
    const messages: Record<Locale, string> = {
      vi: "Tháng 8 năm 980, Lê Hoàn lên ngôi hoàng đế, thụy là Đại hành hoàng đế, lập ra nhà (Tiền) Lê, đánh bại quân Tống xâm lược",
      en: "In August 980, Le Hoan ascended the throne as Emperor Le Dai Hanh, establishing the Early Le Dynasty and repelling Song invaders",
      fr: "En août 980, Lê Hoàn monte sur le trône sous le nom de Lê Đại Hành, fondant la dynastie des Lê antérieurs et repoussant les envahisseurs Song",
      zh: "980年8月，黎桓即皇帝位，谥号大行皇帝，建立前黎朝，并击退宋朝侵略",
      ja: "980年8月、黎桓が皇帝（黎大行皇帝）に即位して前黎朝を開き、宋軍の侵略を撃退しました",
      ko: "980년 8월, 레호안이 황제(대행황제)로 즉위하여 전 레 왕조를 개창하고 송나라의 침략을 격퇴했습니다",
    };
    return {
      id: `tien_le_dynasty_${solarYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?query=Lê+Hoàn&cats=dl`,
    };
  }

  // 13. 31/8 - 2/9 Dương lịch: Quốc khánh 2/9
  if ((solarMonth === 8 && solarDay === 31) || (solarMonth === 9 && solarDay <= 2)) {
    const yearsSince1945 = solarYear - 1945;
    const messages: Record<Locale, string> = {
      vi: `Chào mừng ngày Quốc khánh 2/9/1945 - 2/9/${solarYear} (${yearsSince1945} năm)`,
      en: `Happy Vietnam National Day 2/9/1945 - 2/9/${solarYear} (${yearsSince1945} years)`,
      fr: `Bonne fête nationale du Vietnam 2/9/1945 - 2/9/${solarYear} (${yearsSince1945} ans)`,
      zh: `热烈庆祝越南国庆节 2/9/1945 - 2/9/${solarYear}（${yearsSince1945}周年）`,
      ja: `ベトナム建国記念日を祝して 1945年9月2日 - ${solarYear}年9月2日（${yearsSince1945}周年）`,
      ko: `베트남 국경일 기념 1945년 9월 2일 - ${solarYear}년 9월 2일 (${yearsSince1945}주년)`,
    };
    return {
      id: `national_day_${solarYear}`,
      message: messages[locale] || messages.vi,
    };
  }

  // 14. Ngày 1-2 tháng 11 (DL):
  // "Tháng 11 năm 938, Ngô Quyền đánh bại quân Nam Hán xâm lược nước ta trên sông Bạch Đằng, lập ra nhà Ngô"
  if (solarMonth === 11 && (solarDay === 1 || solarDay === 2)) {
    const messages: Record<Locale, string> = {
      vi: "Tháng 11 năm 938, Ngô Quyền đánh bại quân Nam Hán xâm lược nước ta trên sông Bạch Đằng, lập ra nhà Ngô",
      en: "In November 938, Ngo Quyen defeated the Southern Han invaders on the Bach Dang River, founding the Ngo Dynasty",
      fr: "En novembre 938, Ngô Quyền défait les envahisseurs des Han du Sud sur le fleuve Bạch Đằng, fondant la dynastie Ngô",
      zh: "938年11月，吴权在白藤江大破南汉侵略军，建立吴朝",
      ja: "938年11月、呉権が白藤江の戦いで南漢軍を破り、呉朝を建国しました",
      ko: "938년 11월, 응오꾸옌이 박당강 전투에서 남한 침략군을 격파하고 응오 왕조를 개창했습니다",
    };
    return {
      id: `ngo_dynasty_${solarYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?query=Ngô+Quyền&cats=dl`,
    };
  }

  // 15. Ngày 20-21 tháng 11 (DL):
  // "Tháng 11 năm 1009, Lý Công Uẩn lên ngôi Hoàng đế, lập ra nhà Lý, miếu hiệu là Thái tổ"
  if (solarMonth === 11 && (solarDay === 20 || solarDay === 21)) {
    const messages: Record<Locale, string> = {
      vi: "Tháng 11 năm 1009, Lý Công Uẩn lên ngôi Hoàng đế, lập ra nhà Lý, miếu hiệu là Thái tổ",
      en: "In November 1009, Ly Cong Uan ascended the throne as Emperor Ly Thai To, establishing the Ly Dynasty",
      fr: "En novembre 1009, Lý Công Uẩn monte sur le trône sous le nom de Lý Thái Tổ, fondant la dynastie Lý",
      zh: "1009年11月，李公蕴登基称帝，庙号太祖，建立李朝",
      ja: "1009年11月、李公蘊が皇帝（李太祖）に即位し、李朝が建国されました",
      ko: "1009년 11월, 리꽁우언이 황제(이태조)에 즉위하여 리 왕조를 개창했습니다",
    };
    return {
      id: `ly_dynasty_${solarYear}`,
      message: messages[locale] || messages.vi,
      directUrl: `/search?cats=ly`,
    };
  }

  // 16. 22/11 - 23/11 Dương lịch: Di sản Văn hóa Việt Nam (23/11) và Văn hóa Việt Nam (24/11)
  if (solarMonth === 11 && (solarDay === 22 || solarDay === 23)) {
    const messages: Record<Locale, string> = {
      vi: "Chào mừng ngày Di sản Văn hóa Việt Nam (23/11) và ngày Văn hóa Việt Nam (24/11)",
      en: "Celebrating Vietnam Cultural Heritage Day (23/11) and Vietnam Culture Day (24/11)",
      fr: "Célébration de la Journée du patrimoine culturel du Vietnam (23/11) et de la Journée de la culture vietnamienne (24/11)",
      zh: "庆祝越南文化遗产日（11月23日）及越南文化日（11月24日）",
      ja: "ベトナム文化遺産の日（11月23日）およびベトナム文化の日（11月24日）を記念して",
      ko: "베트남 문화유산의 날 (11/23) 및 베트남 문화의 날 (11/24) 기념",
    };
    return {
      id: `cultural_heritage_${solarYear}`,
      message: messages[locale] || messages.vi,
    };
  }

  // 17. 24/11 Dương lịch: Ngày Văn hóa Việt Nam (24/11)
  if (solarMonth === 11 && solarDay === 24) {
    const messages: Record<Locale, string> = {
      vi: "Chào mừng ngày Văn hóa Việt Nam (24/11)",
      en: "Celebrating Vietnam Culture Day (24/11)",
      fr: "Célébration de la Journée de la culture vietnamienne (24/11)",
      zh: "庆祝越南文化日（11月24日）",
      ja: "ベトナム文化の日（11月24日）を記念して",
      ko: "베트남 문화의 날 (11/24) 기념",
    };
    return {
      id: `vietnam_culture_${solarYear}`,
      message: messages[locale] || messages.vi,
    };
  }

  return null;
}

export const getHolidayNotification = checkHoliday;
