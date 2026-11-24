"use client";

import { motion } from "framer-motion";

export default function Donate() {
  return (
    <motion.section
      className="max-w-7xl mx-auto px-6 md:px-20 flex flex-col justify-center items-center mb-40"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="mx-auto w-3/4 md:w-2/3 flex justify-center mb-8"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <img
          src="/donate.png"
          alt="Donate QR"
          className="w-full h-auto drop-shadow-lg rounded-sm"
          draggable={false}
        />
      </motion.div>

      <div className="space-y-5 max-w-2xl bg-white dark:bg-stone-900 p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm rounded-sm">
        <p className="w-full text-justify text-stone-700 dark:text-stone-300 leading-relaxed">
          <strong>Donate cho tác giả (Admin)</strong>. Số tiền này sẽ được coi
          như là tài sản cá nhân của tác giả, nhưng sẽ được ưu tiên dùng trong
          các hoạt động duy trì trang web như mua tên miền, mua các dịch vụ khác
          bên thứ ba,... để nâng cao trải nghiệm người dùng.
        </p>
        <p className="w-full text-center font-semibold text-viet-red">
          Cảm ơn sự đóng góp của bạn rất nhiều!
        </p>
        <p className="w-full text-justify text-xs text-stone-500 dark:text-stone-400 leading-relaxed border-t border-stone-100 dark:border-stone-800 pt-4">
          Ngân hàng: <strong>Vietinbank</strong> hoặc ví điện tử:{" "}
          <strong>Momo</strong>, STK: <strong>0785563729</strong>, tên chủ TK:{" "}
          <strong>CAO THÁI BẢO</strong>. Nội dung{" "}
          <strong>HAC - Donate - Thông điệp của bạn</strong> (nhằm mục đích
          thống kê).
        </p>
      </div>
    </motion.section>
  );
}
