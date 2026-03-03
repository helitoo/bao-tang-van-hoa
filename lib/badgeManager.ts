"use client";

type Info = {
  numOfViewedArtifacts: number;
  hacked: boolean;
  maxBadgeFloor: number;
};

export type Badge = {
  url: string;
  name: string;
  floor: number;
};

const NORMAL_BADGES: Badge[] = [
  {
    url: "/badge/nm.png",
    name: "Nhập môn",
    floor: 2,
  },
  {
    url: "/badge/ht.png",
    name: "Học trò",
    floor: 10,
  },
  {
    url: "/badge/kvcls.png",
    name: "Khuê Văn các Lễ sinh",
    floor: 50,
  },
  {
    url: "/badge/kvcdh.png",
    name: "Khuê Văn các Đốc học",
    floor: 100,
  },
  {
    url: "/badge/vhdbhs.png",
    name: "Văn hóa Đại biện học sĩ",
    floor: 150,
  },
  {
    url: "/badge/vmddhs.png",
    name: "Văn Minh điện đại học sĩ",
    floor: 200,
  },
  {
    url: "/badge/lnkls.png",
    name: "Lĩnh Nam Kinh lược sứ",
    floor: 300,
  },
  {
    url: "/badge/tvdt.png",
    name: "Tuyên văn đại thần",
    floor: 400,
  },
  {
    url: "/badge/ttvmtvcb.png",
    name: "Thụ thiên vĩnh mệnh tuyên văn đại thần",
    floor: 600,
  },
];

const HACKED_BADGE: Badge = {
  url: "/badge/h.png",
  name: "Xuất quỷ nhập thần",
  floor: 0,
};

const BADGE_INFO_KEY = "badge_info";

const DEFAULT_INFO: Info = {
  numOfViewedArtifacts: 0,
  hacked: false,
  maxBadgeFloor: 0,
};

function getEncodeInfo(info: Info) {
  return encodeURIComponent(JSON.stringify(info));
}

function getDecodeInfo(encoded: string): Info {
  return JSON.parse(decodeURIComponent(encoded));
}

function getInfo() {
  const encoded = localStorage.getItem(BADGE_INFO_KEY);
  if (!encoded) {
    localStorage.setItem(BADGE_INFO_KEY, getEncodeInfo(DEFAULT_INFO));
    return DEFAULT_INFO;
  } else {
    try {
      const decoded = getDecodeInfo(encoded);

      if (
        decoded.numOfViewedArtifacts < decoded.maxBadgeFloor ||
        ![...NORMAL_BADGES.map((b) => b.floor), 0].includes(
          decoded.maxBadgeFloor,
        )
      ) {
        decoded.hacked = true;
        decoded.maxBadgeFloor = 0;
        decoded.numOfViewedArtifacts = 0;
        localStorage.setItem(BADGE_INFO_KEY, getEncodeInfo(decoded));
      }

      return decoded;
    } catch (e) {
      DEFAULT_INFO.hacked = true;
      localStorage.setItem(BADGE_INFO_KEY, getEncodeInfo(DEFAULT_INFO));
      return DEFAULT_INFO;
    }
  }
}

export function getBadges() {
  let info = getInfo();

  let badges = NORMAL_BADGES.filter(
    (badge) => badge.floor <= info.numOfViewedArtifacts,
  );

  if (
    badges.length &&
    Math.max(...badges.map((badge) => badge.floor)) != info.maxBadgeFloor
  ) {
    badges.length = 0;
    info = DEFAULT_INFO;
    info.hacked = true;
    localStorage.setItem(BADGE_INFO_KEY, getEncodeInfo(info));
  }

  if (info.hacked) badges.push(HACKED_BADGE);
  return badges;
}

function getMaxBadge(info: Info) {
  return NORMAL_BADGES.filter((b) => b.floor <= info.numOfViewedArtifacts).sort(
    (a, b) => b.floor - a.floor,
  )[0];
}

export function setInfo(): Promise<Badge | undefined> {
  const info = getInfo();

  return new Promise((resolve) => {
    setTimeout(() => {
      const newInfo: Info = {
        numOfViewedArtifacts: info.numOfViewedArtifacts + 1,
        hacked: info.hacked,
        maxBadgeFloor: info.maxBadgeFloor,
      };

      const maxBadge = getMaxBadge(newInfo);

      if (!maxBadge || newInfo.maxBadgeFloor > maxBadge.floor) {
        localStorage.setItem(BADGE_INFO_KEY, getEncodeInfo(newInfo));
        resolve(undefined);
      } else if (newInfo.maxBadgeFloor < maxBadge.floor) {
        newInfo.maxBadgeFloor = maxBadge.floor;
        localStorage.setItem(BADGE_INFO_KEY, getEncodeInfo(newInfo));
        resolve(maxBadge);
      }

      localStorage.setItem(BADGE_INFO_KEY, getEncodeInfo(newInfo));
      resolve(undefined);
    }, 5000); // 5s
    // }, 0);
  });
}
