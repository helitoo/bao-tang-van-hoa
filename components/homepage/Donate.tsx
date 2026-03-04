export default function Donate() {
  return (
    <section className="max-w-7xl mx-auto px-10 md:px-20 flex flex-col justify-center items-center mb-50">
      <img
        src="/donate.png"
        alt="Donate QR"
        className="mx-auto w-3/4 md:w-2/3 h-auto"
        draggable={false}
      />
      <div className="space-y-5">
        <p className="w-full text-justify">
          <strong>Donate cho tác giả (Admin)</strong>. Số tiền này sẽ được coi
          như là tài sản cá nhân của tác giả, nhưng sẽ được ưu tiên dùng trong
          các hoạt động duy trì trang web như mua tên miền, mua các dịch vụ khác
          bên thứ ba,... để nâng cao trải nghệm người dùng.
        </p>
        <p className="w-full text-center">
          Cảm ơn sự đóng góp của bạn rất nhiều!
        </p>
        <p className="w-full text-justify">
          Ngân hàng: <strong>Vietinbank</strong> hoặc ví điện tử:{" "}
          <strong>Momo</strong>, STK: <strong>0785563729</strong>, tên chủ TK:{" "}
          <strong>CAO THÁI BẢO</strong>. Nội dung{" "}
          <strong>BTVHVN - Donate - Thông điệp của bạn</strong> (nhằm mục đích
          thống kê).
        </p>
      </div>
    </section>
  );
}
