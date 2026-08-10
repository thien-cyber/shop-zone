import React from "react";
import "./globals.css"; // File CSS cấu hình Tailwind gốc của Next.js
import Header from "../components/layout/Header";
import CategoryNav from "../components/layout/CategoryNav";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "ShopZone — Hệ Thống Siêu Sàn Thương Mại Điện Tử 2026",
  description:
    "Trải nghiệm mua sắm thiết bị công nghệ, thời trang, mỹ phẩm chính hãng với ưu đãi bùng nổ, thanh toán an toàn bảo mật tuyệt đối.",
  keywords:
    "shopzone, mua sắm trực tuyến, thương mại điện tử, sản phẩm chính hãng",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col font-sans">
        <Header />
        <CategoryNav />
        <div className="flex-1 w-full">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
