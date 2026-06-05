import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-white font-black text-2xl tracking-tight"
            >
              <span className="text-indigo-500">Shop</span>Zone
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trải nghiệm mua sắm trực tuyến vượt trội với hệ thống phân phối
              chính hãng, dịch vụ khách hàng chuyên nghiệp và công nghệ giao
              dịch bảo mật tuyệt đối.
            </p>
          </div>

          {/* Cột 2: Về chúng tôi */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Về chúng tôi
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-indigo-400 transition"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-indigo-400 transition"
                >
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-indigo-400 transition"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-indigo-400 transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Hỗ trợ
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/help/guide"
                  className="hover:text-indigo-400 transition"
                >
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/help/returns"
                  className="hover:text-indigo-400 transition"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  href="/help/privacy"
                  className="hover:text-indigo-400 transition"
                >
                  Bảo mật thông tin
                </Link>
              </li>
              <li>
                <Link
                  href="/help/terms"
                  className="hover:text-indigo-400 transition"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Theo dõi mạng xã hội */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Theo dõi chúng tôi
            </h3>
            <div className="flex gap-4 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition"
              >
                FB
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition"
              >
                IG
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition"
              >
                TT
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition"
              >
                YT
              </a>
            </div>
            <p className="text-xs text-slate-400">
              Đăng ký nhận tin tức khuyến mãi sớm nhất qua hệ thống.
            </p>
          </div>
        </div>

        {/* Thanh bản quyền & Cổng thanh toán liên kết */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            © 2026 ShopZone. All rights reserved. Hệ thống e-commerce vận hành
            trên nền tảng High-Scalability.
          </div>
          <div className="flex items-center gap-3 grayscale opacity-60">
            <span className="px-2 py-1 bg-slate-800 rounded font-bold text-white tracking-wider">
              VISA
            </span>
            <span className="px-2 py-1 bg-slate-800 rounded font-bold text-white tracking-wider">
              MASTER
            </span>
            <span className="px-2 py-1 bg-slate-800 rounded font-bold text-indigo-400 tracking-wider">
              VNPAY
            </span>
            <span className="px-2 py-1 bg-slate-800 rounded font-bold text-pink-400 tracking-wider">
              MOMO
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
