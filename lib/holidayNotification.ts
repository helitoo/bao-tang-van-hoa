import type { Locale } from "@/lib/lang";
import { convertSolar2Lunar, convertLunar2Solar } from "@/lib/lunarConverter";

export interface HolidayInfo {
  id: string;
  message: string;
  dateKey: string;
}

export function getHolidayNotification(
  inputDate = new Date(),
  locale: Locale = "vi"
): HolidayInfo | null {
  const solarDay = inputDate.getDate();
  const solarMonth = inputDate.getMonth() + 1; // 1-12
  const solarYear = inputDate.getFullYear();

  const lunar = convertSolar2Lunar(solarDay, solarMonth, solarYear);
  const lunarDay = lunar.day;
  const lunarMonth = lunar.month;
  const lunarYear = lunar.year;

  // 1. 23/12 - 3/1 Âm lịch: Tết Nguyên Đán
  const isTet =
    (lunarMonth === 12 && lunarDay >= 23) ||
    (lunarMonth === 1 && lunarDay <= 3);

  if (isTet) {
    const nextTetYear =
      lunarMonth === 12
        ? convertLunar2Solar(1, 1, lunarYear + 1).year
        : convertLunar2Solar(1, 1, lunarYear).year;

    const messages: Record<Locale, string> = {
      vi: `Chào mừng Tết Nguyên Đán ${nextTetYear}.`,
      en: `Celebrating Lunar New Year ${nextTetYear}.`,
      fr: `Joyeux Nouvel An Lunaire ${nextTetYear}.`,
      zh: `欢度 ${nextTetYear} 农历新年。`,
      ja: `${nextTetYear}年の旧正月（テト）を祝して。`,
      ko: `${nextTetYear}년 음력 설날(Tet)을 맞이하여.`,
    };

    return {
      id: "tet",
      message: messages[locale] || messages.vi,
      dateKey: `tet_${solarYear}_${lunarMonth}_${lunarDay}`,
    };
  }

  // 2. 8/3 - 10/3 Âm lịch: Giỗ tổ Hùng Vương (10/3)
  if (lunarMonth === 3 && lunarDay >= 8 && lunarDay <= 10) {
    const messages: Record<Locale, string> = {
      vi: "Chào mừng ngày Giỗ tổ Hùng vương (10/3).",
      en: "Commemorating Hung Kings Temple Festival (10/3).",
      fr: "Commémoration des Rois Hung (10/3).",
      zh: "纪念雄王节（农历三月初十）。",
      ja: "フン王の命日（旧暦3月10日）を祝して。",
      ko: "흥왕 숭배 기념일(음력 3월 10일)을 맞이하여.",
    };

    return {
      id: "hung_kings",
      message: messages[locale] || messages.vi,
      dateKey: `hung_kings_${lunarYear}_${lunarMonth}_${lunarDay}`,
    };
  }

  // 3. 28/4 - 30/4 Dương lịch: Giải phóng miền Nam
  if (solarMonth === 4 && solarDay >= 28 && solarDay <= 30) {
    const messages: Record<Locale, string> = {
      vi: `Chào mừng ngày Giải phóng miền Nam, thống nhất đất nước 30/4/1975 - 30/4/${solarYear}.`,
      en: `Commemorating Liberation Day & National Reunification 30/4/1975 - 30/4/${solarYear}.`,
      fr: `Commémoration de la Libération du Sud et Réunification Nationale 30/4/1975 - 30/4/${solarYear}.`,
      zh: `纪念南方解放与国家统一日 1975年4月30日 - ${solarYear}年4月30日。`,
      ja: `南部解放・国家統一記念日（1975年4月30日～${solarYear}年4月30日）。`,
      ko: `남부 해방 및 국가 통일의 날 1975년 4월 30일 - ${solarYear}년 4월 30일.`,
    };

    return {
      id: "reunification",
      message: messages[locale] || messages.vi,
      dateKey: `reunification_${solarYear}_${solarDay}`,
    };
  }

  // 4. 14/8 - 15/8 Âm lịch: Tết Trung thu (15/8)
  if (lunarMonth === 8 && lunarDay >= 14 && lunarDay <= 15) {
    const messages: Record<Locale, string> = {
      vi: "Chào mừng ngày tết Trung thu (15/8).",
      en: "Happy Mid-Autumn Festival (15/8).",
      fr: "Joyeuse Fête de la Mi-Automne (15/8).",
      zh: "欢度中秋佳节（农历八月十五）。",
      ja: "中秋節・中秋の名月（旧暦8月15日）を祝して。",
      ko: "추석(음력 8월 15일)을 맞이하여.",
    };

    return {
      id: "mid_autumn",
      message: messages[locale] || messages.vi,
      dateKey: `mid_autumn_${lunarYear}_${lunarMonth}_${lunarDay}`,
    };
  }

  // 5. 31/8 - 2/9 Dương lịch: Quốc khánh 2/9
  if (
    (solarMonth === 8 && solarDay === 31) ||
    (solarMonth === 9 && solarDay >= 1 && solarDay <= 2)
  ) {
    const messages: Record<Locale, string> = {
      vi: `Chào mừng ngày Quốc khánh 2/9/1945 - 2/9/${solarYear}.`,
      en: `Commemorating Vietnam National Day 2/9/1945 - 2/9/${solarYear}.`,
      fr: `Commémoration de la Fête Nationale du Vietnam 2/9/1945 - 2/9/${solarYear}.`,
      zh: `庆祝越南国庆节 1945年9月2日 - ${solarYear}年9月2日。`,
      ja: `ベトナム建国記念日（1945年9月2日～${solarYear}年9月2日）。`,
      ko: `베트남 독립기념일 1945년 9월 2일 - ${solarYear}년 9월 2일.`,
    };

    return {
      id: "national_day",
      message: messages[locale] || messages.vi,
      dateKey: `national_day_${solarYear}_${solarMonth}_${solarDay}`,
    };
  }

  // 6. 22/11 - 23/11 Dương lịch: Di sản Văn hóa Việt Nam (23/11) & Văn hóa Việt Nam (24/11)
  if (solarMonth === 11 && (solarDay === 22 || solarDay === 23)) {
    const messages: Record<Locale, string> = {
      vi: "Chào mừng ngày Di sản Văn hóa Việt Nam (23/11) và ngày Văn hóa Việt Nam (24/11).",
      en: "Celebrating Vietnam Cultural Heritage Day (23/11) and Vietnam Culture Day (24/11).",
      fr: "Célébration de la Journée du Patrimoine Culturel du Vietnam (23/11) et de la Journée de la Culture Vietnamienne (24/11).",
      zh: "庆祝越南文化遗产日（11月23日）暨越南文化日（11月24日）。",
      ja: "ベトナム文化遺産の日（11月23日）およびベトナム文化の日（11月24日）を祝して。",
      ko: "베트남 문화유산의 날(11월 23일) 및 베트남 문화의 날(11월 24일)을 맞이하여.",
    };

    return {
      id: "heritage_and_culture_day",
      message: messages[locale] || messages.vi,
      dateKey: `heritage_and_culture_${solarYear}_${solarDay}`,
    };
  }

  // 7. 24/11 Dương lịch: Ngày Văn hóa Việt Nam (24/11)
  if (solarMonth === 11 && solarDay === 24) {
    const messages: Record<Locale, string> = {
      vi: "Chào mừng ngày Văn hóa Việt Nam (24/11).",
      en: "Celebrating Vietnam Culture Day (24/11).",
      fr: "Célébration de la Journée de la Culture Vietnamienne (24/11).",
      zh: "庆祝越南文化日（11月24日）。",
      ja: "ベトナム文化の日（11月24日）を祝して。",
      ko: "베트남 문화의 날(11월 24일)을 맞이하여.",
    };

    return {
      id: "culture_day",
      message: messages[locale] || messages.vi,
      dateKey: `culture_day_${solarYear}_${solarDay}`,
    };
  }

  return null;
}
