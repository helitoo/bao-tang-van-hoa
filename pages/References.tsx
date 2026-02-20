import React from "react";
import { useLanguage } from "../App";
// Fix: Use namespace import for react-router-dom to resolve export issues
import * as ReactRouterDOM from "react-router-dom";
const { Link } = ReactRouterDOM;

const refFanpages = [
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

const refGroups = [
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

const refRes = [
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

const refBooks = [
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

const ReferenceSection = ({ label, data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="mb-12 font-sans text-gray-800">
      {/* Label với đường gạch chân đặc trưng */}
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-bold tracking-widest text-red-700 mr-4">
          {label}
        </h2>
        <div className="flex-1 h-px bg-stone-500"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="group border-l-2 border-transparent hover:border-red-700 pl-4 transition-all duration-300"
          >
            <h3 className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              {item.name}
            </h3>

            {item.desc && (
              <p className="mt-1 text-sm text-stone-500 leading-relaxed">
                {item.desc}
              </p>
            )}

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                className="mt-1 text-[10px] text-stone-500 leading-relaxed font-light hover:text-viet-red truncate block max-w-full"
              >
                {item.url}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const References: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 min-h-[calc(100vh-5rem)]">
      <div className="flex flex-col items-center mb-16 text-center">
        <nav className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-4">
          <Link to="/" className="hover:text-viet-red transition-colors">
            {t("nav_home")}
          </Link>
          <span>/</span>
          <span className="text-viet-red">{t("nav_references")}</span>
        </nav>
        <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-tight mb-4">
          {t("nav_references")}
        </h1>
        <div className="h-1 w-24 bg-viet-red shadow-lg mb-6"></div>
      </div>

      <div className="relative">
        <ReferenceSection label="Fanpages" data={refFanpages} />
        <ReferenceSection label="Hội nhóm" data={refGroups} />
        <ReferenceSection label="Tài nguyên số" data={refRes} />
        <ReferenceSection label="Sách giấy" data={refBooks} />
      </div>
    </div>
  );
};

export default References;
