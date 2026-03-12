export type Ref = {
  name: string;
  sptName?: string;
  desc?: string;
  url?: string;
};

export const FanpageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-sticky-note-icon lucide-sticky-note"
  >
    <path d="M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
    <path d="M15 3v5a1 1 0 0 0 1 1h5" />
  </svg>
);

export const GroupIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-users-icon lucide-users"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <path d="M16 3.128a4 4 0 0 1 0 7.744" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <circle cx="9" cy="7" r="4" />
  </svg>
);

export const ResIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-package-icon lucide-package"
  >
    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
    <path d="M12 22V12" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <path d="m7.5 4.27 9 5.15" />
  </svg>
);

export const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-book-text-icon lucide-book-text"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
    <path d="M8 11h8" />
    <path d="M8 7h6" />
  </svg>
);

export const MuseumIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-landmark-icon lucide-landmark"
  >
    <path d="M10 18v-7" />
    <path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" />
    <path d="M14 18v-7" />
    <path d="M18 18v-7" />
    <path d="M3 22h18" />
    <path d="M6 18v-7" />
  </svg>
);

export const refFanpages: Ref[] = [
  {
    name: "Hoa văn Đại Việt",
    url: "https://www.facebook.com/hoavandaiviet",
  },
  {
    name: "Đại Việt phong hoa - 大越豐華",
    url: "https://www.facebook.com/Daivietphonghoa",
  },
  {
    name: "Bác văn ước lễ - 博文約禮",
    url: "https://www.facebook.com/bacvanuocle",
  },
  {
    name: "Huyền tinh tác đấu - 懸星作枓",
    url: "https://www.facebook.com/huyentinhtacdau",
  },
  {
    name: "Lược sử tộc Việt",
    url: "https://www.facebook.com/lstvfanpage",
  },
  {
    name: "Đại Việt thần thoại",
    url: "https://www.facebook.com/profile.php?id=61571214249611",
  },
  {
    name: "Made in Vietnam",
    url: "https://www.facebook.com/madeinvietnam2024",
  },
  {
    name: "Tòn lon ton",
    url: "https://www.tiktok.com/@tonlonton92",
  },
  {
    name: "Địa phương chí",
    url: "https://www.tiktok.com/@diaphuongchi",
  },
  {
    name: "Bửu liên - Đi cùng di sản",
    url: "https://www.tiktok.com/@buulien.dicungdisan",
  },
];

export const refGroups: Ref[] = [
  {
    name: "Hoàng triều Hậu Lê",
    url: "https://www.facebook.com/groups/423701537299844",
  },
  {
    name: "Đại Việt cổ phong",
    url: "https://www.facebook.com/groups/630359420385614",
  },
  {
    name: "Huế cổ phong",
    url: "https://www.facebook.com/groups/462469104898861",
  },
  {
    name: "Hoa văn cổ",
    url: "https://www.facebook.com/groups/24094649860154804",
  },
];

export const refRes: Ref[] = [
  {
    name: "Hoa văn Đại Việt",
    url: "https://hoavandaiviet.vn/",
  },
  {
    name: "Đại Nam hoa văn mạn lục",
    url: "https://drive.google.com/drive/folders/1EWKhUWLbnvn9UmI-2ZGx7NnSZkqrymtm?usp=sharing",
  },
  {
    name: "Thi viện",
    url: "https://www.thivien.net/",
  },
  {
    name: "Từ điển Hán Nôm",
    url: "https://hvdic.thivien.net/",
  },
];

export const refBooks: Ref[] = [
  {
    name: "嶺南摭怪",
    sptName: "Lĩnh Nam chích quái",
    desc: "Những chuyện thần thánh, ma quỷ kỳ dị ở nước ta.",
  },
  {
    name: "越甸幽靈集 (Lý Tế Xuyên, 1329)",
    sptName: "Việt điện u linh tập",
    desc: "Những thần tích ở nước ta.",
  },
  {
    name: "A Description of the Kingdom of Tonqueen (Samuel Baron, 1685)",
    sptName: "Mô tả vương quốc Đàng Ngoài",
    desc: "Ghi chép tổng hợp về phong tục, tập quán, trang phục,... ở vùng Bắc bộ thời Lê Trung hưng.",
  },
  {
    name: "Les symboles, les emblèmes et les accessoires du culte chez les Annamites (Gustave Dumoutier, 1891)",
    sptName: "Biểu tượng, phù hiệu và đồ thờ của người An Nam",
    desc: "Mỹ thuật cổ trong các vật phẩm tâm linh truyền thống Việt Nam.",
    url: "https://archive.org/details/MN40218ucmf_6/mode/1up",
  },
  {
    name: "Psychologie du peuple Annamites (Paul Giran, 1904)",
    sptName: "Tâm lý người An Nam",
    desc: "Tính cách dân tộc, tiến trình lịch sử, tri thức, xã hội và chính trị.",
  },
  {
    name: "Le rituel funéraire des Annamites (Gustave Dumoutier, 1904)",
    sptName: "Tang lễ của người An Nam",
    desc: "Nghiên cứu dân tộc học về tín ngưỡng cổ truyền.",
    url: "https://archive.org/details/lerituelfunerair00dumo/mode/1up",
  },
  {
    name: "Technique du peuple Annamite (Henri Oger, 1909)",
    sptName: "Kỹ thuật của người An Nam",
    desc: "Ghi chép tổng hợp về phong tục, tập quán, trang phục,... ở vùng Bắc bộ thời Pháp thuộc.",
  },
  {
    name: "Magie & religion annamites (Paul Giran, 1912)",
    sptName: "Phù thuật & Tín ngưỡng An Nam",
    desc: "Nhập môn triết học văn minh của người An Nam.",
  },
  {
    name: "Việt Nam phong tục (Phan Kế Bính, 1915)",
    desc: "Sách ghi chép những phong tục ở nước ta.",
  },
  {
    name: "Historique du musée, Sélection d'objets d'art et meubles conserves au musée Khai-Dinh et notices les concernant (P.Jabouille - J.H. Peyssonnaux, 1931)",
    sptName: "Lược sử Bảo tàng, Tuyển tập hiện vật tại bảo tàng Khải Định",
    desc: "Tuyển tập hiện vật ở Bảo tàng Khải Định",
    url: "https://humazur.univ-cotedazur.fr/files/original/b5bd6b7ef65d74311255ea42f2d2e0134e6a6058.pdf",
  },
  {
    name: "Ngàn năm áo mũ (Trần Quang Đức, 2013)",
    desc: "Lịch sử trang phục Việt Nam giai đoạn 1009 - 1945.",
  },
  {
    name: "Bulletin des Amis du Vieux Hué (BAVH) (Léopold Cadière, 1914 - 1944)",
    sptName: "Hội Những người bạn Cố đô Huế",
    desc: "Ghi chép tổng hợp về phong tục, tập quán, trang phục,... ở Huế thời Pháp thuộc.",
  },

  {
    name: "Lôi động, Tinh phi (Đông Nguyễn, Kaovjets Ngujens)",
    desc: "Khảo cứu về súng đạn người Việt.",
  },
  {
    name: "Kì công diệu nghệ (Đông Nguyễn, Kaovjets Ngujens, Phan Cẩm Thượng (hiệu đính))",
    desc: "Một số kỹ thuật và công nghệ trên dải đất hình chữ S trước thế kỷ XX.",
  },
  {
    name: "Thần Long Kích Thủy (Đông Nguyễn, Kaovjets Ngujens, Đỗ Thái Bình - Trần Trọng Dương (hiệu đính))",
    desc: "Lịch sử thuyền chiến Việt Nam.",
  },
];

export const museums: Ref[] = [
  {
    name: "Musée du Quai Branly - Jacques Chirac",
    url: "https://collections.quaibranly.fr",
  },
  {
    name: "École Française d'extrême-orient (Viện Viễn đông bác cổ)",
    url: "https://www.efeo.fr/",
  },
  {
    name: "Bảo tàng Mỹ thuật Việt Nam",
    url: "https://www.facebook.com/baotangmythuat",
  },
  {
    name: "Bảo tàng Lịch sử Thành phố Hồ Chí Minh",
    url: "https://www.facebook.com/baotanglichsu",
  },
  {
    name: "Bảo tàng Lịch sử Quốc gia",
    url: "https://www.facebook.com/BTLSQG.VNMH",
  },
  {
    name: "Trung tâm Bảo tồn Di tích Cố đô Huế",
    url: "https://www.facebook.com/hueworldheritage.org.vn",
  },
];
