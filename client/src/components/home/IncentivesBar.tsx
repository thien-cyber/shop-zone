import React from "react";

export default function IncentivesBar() {
  const incentives = [
    {
      icon: "🚚",
      title: "Miễn phí vận chuyển",
      desc: "Áp dụng cho mọi đơn từ 500.000₫",
    },
    {
      icon: "🔄",
      title: "Đổi trả 30 ngày",
      desc: "Đổi trả nhanh không cần lý do",
    },
    {
      icon: "🛡️",
      title: "Bảo hành chính hãng",
      desc: "Cam kết 100% sản phẩm nguồn gốc chuẩn",
    },
    {
      icon: "💳",
      title: "Thanh toán an toàn",
      desc: "Hỗ trợ mã hóa qua Stripe & VNPAY",
    },
  ];

  return (
    <div className="bg-indigo-50/70 border-y border-indigo-100/50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 md:grid-cols-4 lg:gap-x-8">
          {incentives.map((item, index) => (
            <div key={index} className="flex gap-3 items-start md:items-center">
              <span
                className="text-2xl sm:text-3xl select-none"
                role="img"
                aria-label="incentive"
              >
                {item.icon}
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
