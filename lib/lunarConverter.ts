/**
 * Thuật toán chuyển đổi Lịch Âm - Dương Việt Nam (UTC+7)
 * Tác giả gốc: Hồ Ngọc Đức (Viện Công nghệ Thông tin)
 */

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
}

export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

const PI = Math.PI;

function INT(d: number): number {
  return Math.floor(d);
}

function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd +
    INT((153 * m + 2) / 5) +
    365 * y +
    INT(y / 4) -
    INT(y / 100) +
    INT(y / 400) -
    32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

function jdToDate(jd: number): SolarDate {
  let a: number, b: number, c: number, d: number, e: number, m: number;
  if (jd > 2299160) {
    a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((146097 * b) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  d = INT((4 * c + 3) / 1461);
  e = c - INT((1461 * d) / 4);
  m = INT((5 * e + 2) / 153);
  const day = e - INT((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * INT(m / 10);
  const year = 100 * b + d - 4800 + INT(m / 10);
  return { day, month, year };
}

function getNewMoonDay(k: number, timeZone = 7): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let Jd1 =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3;
  Jd1 +=
    0.00033 *
    Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

  let C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
    0.0021 * Math.sin(2 * dr * M);
  C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
  C1 -= 0.0004 * Math.sin(3 * dr * Mpr);
  C1 += 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin((M + Mpr) * dr);
  C1 -= 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
  C1 -= 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
  C1 +=
    0.001 * Math.sin((2 * F - Mpr) * dr) +
    0.0005 * Math.sin((2 * Mpr + M) * dr);

  const Jd = Jd1 + C1;
  return INT(Jd + 0.5 + timeZone / 24);
}

function getSunLongitude(dayNumber: number, timeZone = 7): number {
  const T = (dayNumber - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL =
    (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L = L - 2 * PI * INT(L / (2 * PI));
  return INT((L / PI) * 6);
}

export function convertSolar2Lunar(
  solarDay: number,
  solarMonth: number,
  solarYear: number,
  timeZone = 7
): LunarDate {
  const dayNumber = jdFromDate(solarDay, solarMonth, solarYear);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  let a11 = getNewMoonDay(INT((jdFromDate(31, 12, solarYear) - 2415021.076998695) / 29.530588853), timeZone);
  let b11 = a11;
  if (getSunLongitude(a11, timeZone) >= 9) {
    b11 = getNewMoonDay(INT((jdFromDate(31, 12, solarYear) - 2415021.076998695) / 29.530588853) - 1, timeZone);
  }

  let lunarYear = solarYear;
  if (dayNumber >= b11) {
    lunarYear = solarYear;
    a11 = b11;
  } else {
    lunarYear = solarYear - 1;
    a11 = getNewMoonDay(INT((jdFromDate(31, 12, solarYear - 1) - 2415021.076998695) / 29.530588853), timeZone);
    if (getSunLongitude(a11, timeZone) >= 9) {
      a11 = getNewMoonDay(INT((jdFromDate(31, 12, solarYear - 1) - 2415021.076998695) / 29.530588853) - 1, timeZone);
    }
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;

  if (diff >= 0) {
    let leapMonthDiff = -1;
    let arc = getSunLongitude(a11, timeZone);
    for (let i = 1; i <= 14; i++) {
      const nm = getNewMoonDay(INT((a11 - 2415021.076998695) / 29.530588853) + i, timeZone);
      const newArc = getSunLongitude(nm, timeZone);
      if (newArc === arc && leapMonthDiff === -1) {
        leapMonthDiff = i - 1;
      }
      arc = newArc;
    }

    if (leapMonthDiff !== -1) {
      if (diff === leapMonthDiff) {
        lunarLeap = true;
        lunarMonth = diff + 10;
      } else if (diff > leapMonthDiff) {
        lunarMonth = diff + 10;
      }
    }
  }

  if (lunarMonth > 12) lunarMonth = lunarMonth - 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear = lunarYear - 1;

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeap: lunarLeap,
  };
}

export function convertLunar2Solar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  lunarLeap = false,
  timeZone = 7
): SolarDate {
  let a11 = getNewMoonDay(INT((jdFromDate(31, 12, lunarYear) - 2415021.076998695) / 29.530588853), timeZone);
  if (getSunLongitude(a11, timeZone) >= 9) {
    a11 = getNewMoonDay(INT((jdFromDate(31, 12, lunarYear) - 2415021.076998695) / 29.530588853) - 1, timeZone);
  }

  let k = INT((a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) off += 12;

  let leapOff = -1;
  let arc = getSunLongitude(a11, timeZone);
  for (let i = 1; i <= 14; i++) {
    const nm = getNewMoonDay(k + i, timeZone);
    const newArc = getSunLongitude(nm, timeZone);
    if (newArc === arc && leapOff === -1) {
      leapOff = i - 1;
    }
    arc = newArc;
  }

  if (leapOff !== -1) {
    if (lunarLeap) {
      off = leapOff;
    } else if (off >= leapOff) {
      off += 1;
    }
  }

  const monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}
