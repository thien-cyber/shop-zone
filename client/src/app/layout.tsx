// client/src/app/layout.tsx
import React from 'react';
import './globals.css'; // File CSS cấu hình Tailwind gốc của Next.js
import Header from '../components/layout/Header';
import CategoryNav from '../components/layout/CategoryNav';
import Footer from '../components/layout/Footer';

// Cấu hình SEO Metadata tổng thể cho toàn sàn ShopZone
export const metadata = {
  title: 'ShopZone — Hệ Thống Siêu Sàn Thương Mại Điện Tử 2026',
  description: 'Trải nghiệm mua sắm thiết bị công nghệ, thời trang, mỹ phẩm chính hãng với ưu đãi bùng nổ, thanh toán an toàn bảo mật tuyệt đối.',
  keywords: 'shopzone, mua sắm trực tuyến, thương mại điện tử, sản phẩm chính hãng',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col font-sans">
        
        {/* 1. Navbar chính (Chứa Logo, Tìm kiếm, Giỏ hàng Zustand, Avatar Auth) */}
        <Header />
        
        {/* 2. Thanh danh mục phụ nằm ngang (Sticky dưới Header trên Desktop) */}
        <CategoryNav />
        
        {/* 3. Lõi nội dung động - Nơi hiển thị code của các file page.tsx (Home, Login, Register...) */}
        <div className="flex-1 w-full">
          {children}
        </div>
        
        {/* 4. Chân trang cố định chứa thông tin liên hệ và chính sách sàn */}
        <Footer />
        
      </body>
    </html>
  );
}