export type Ref = {
  name: string;
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

export const refFanpages: Ref[] = [
  {
    name: "Hoa văn Đại Việt",
    url: "https://www.facebook.com/hoavandaiviet",
  },
  {
    name: "Đại Việt phong hoa",
    url: "https://www.facebook.com/Daivietphonghoa",
  },
  {
    name: "Bác văn ước lễ",
    url: "https://www.facebook.com/bacvanuocle",
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
    name: "Bửu liên - Đi cùng di sản",
    url: "https://www.tiktok.com/@buulien.dicungdisan",
  },
  {
    name: "Địa phương chí",
    url: "https://www.tiktok.com/@diaphuongchi",
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
    desc: "Hoa văn cổ Việt Nam",
    url: "https://hoavandaiviet.vn/",
  },
  {
    name: "Đại Nam hoa văn mạn lục",
    desc: "Hoa văn nhà Nguyễn",
    url: "https://drive.google.com/drive/folders/1EWKhUWLbnvn9UmI-2ZGx7NnSZkqrymtm?usp=sharing",
  },
  {
    name: "Thi viện",
    desc: "Hệ thống văn thơ Việt Nam",
    url: "https://www.thivien.net/",
  },
  {
    name: "Từ điển Hán Nôm",
    desc: "Tra cứu từ vựng Hán, Nôm",
    url: "https://hvdic.thivien.net/",
  },
];

export const refBooks: Ref[] = [
  {
    name: "嶺南摭怪 - Lĩnh Nam chích quái",
    desc: "Sách ghi chép những chuyện thần thánh, ma quỷ kỳ dị ở nước ta.",
  },
  {
    name: "越甸幽靈集 - Việt điện u linh tập (Lý Tế Xuyên, 1329)",
    desc: "Sách ghi chép những thần tích ở nước ta.",
  },
  {
    name: "A Description of the Kingdom of Tonqueen - Mô tả vương quốc Đàng Ngoài (Samuel Baron, 1685)",
    desc: "Ghi chép tổng hợp về phong tục, tập quán, trang phục,... ở vùng Bắc bộ thời Lê Trung hưng.",
  },
  {
    name: "Les symboles, les emblèmes et les accessoires du culte chez các Annamites - Biểu tượng, phù hiệu và đồ thờ của người An Nam (Gustave Dumoutier, 1891)",
    desc: "Mỹ thuật cổ trong các vật phẩm tâm linh truyền thống Việt Nam.",
  },
  {
    name: "Psychologie du peuple annamite - Tâm lý người An Nam (Paul Giran, 1904)",
    desc: "Tính cách dân tộc, tiến trình lịch sử, tri thức, xã hội và chính trị.",
  },
  {
    name: "Le Deuil et les rites funéraires chez les Annamites - Tang lễ của người An Nam (Gustave Dumoutier, 1904)",
    desc: "Nghiên cứu dân tộc học về tín ngưỡng cổ truyền.",
  },
  {
    name: "Technique du peuple Annamite - Kỹ thuật của người An Nam (Henri Oger, 1909)",
    desc: "Ghi chép tổng hợp về phong tục, tập quán, trang phục,... ở vùng Bắc bộ thời Pháp thuộc.",
  },
  {
    name: "Magie & religion annamites - Phù thuật & Tín ngưỡng An Nam (Paul Giran, 1912)",
    desc: "Nhập môn triết học văn minh của người An Nam.",
  },
  {
    name: "Việt Nam phong tục (Phan Kế Bính, 1915)",
    desc: "Sách ghi chép những phong tục ở nước ta.",
  },
  {
    name: "Ngàn năm áo mũ (Trần Quang Đức, 2013)",
    desc: "Lịch sử trang phục Việt Nam giai đoạn 1009 - 1945.",
  },
  {
    name: "Bulletin des Amis du Vieux Hué - Hội Những người bạn Cố đô Huế (BAVH) (Léopold Cadière, 1914 - 1944)",
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
