import HeroBanner from "../components/home/HeroBanner";
import IncentivesBar from "../components/home/IncentivesBar";
import FlashSaleSection from "../components/home/FlashSaleSection";
import CategorySection from "../components/home/CategorySection";
import ProductSection from "../components/home/ProductSection";
import VoucherZone from "@/components/home/VoucherZone";
import BrandSection from "@/components/home/BrandSection";
import {
  MOCK_BANNERS,
  MOCK_CATEGORIES,
  MOCK_FLASH_SALE,
  MOCK_NEW_PRODUCTS,
  MOCK_BEST_SELLERS,
  MOCK_BRANDS,
  MOCK_HOME_VOUCHERS,
} from "../mocks/homepage.mock";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Gây ấn tượng */}
      <HeroBanner banners={MOCK_BANNERS} />

      {/* 3. Tạo urgency — user còn đang hứng khởi */}
      <FlashSaleSection flashSale={MOCK_FLASH_SALE} />

      {/* 4. Hướng dẫn khám phá */}
      <CategorySection categories={MOCK_CATEGORIES} />

      {/* 5. Sản phẩm mới */}
      <ProductSection
        title="Sản phẩm mới nhất"
        subtitle="Cập nhật xu hướng công nghệ và thời trang đi đầu hệ thống"
        products={MOCK_NEW_PRODUCTS}
        viewAllLink="/products?sort=newest"
      />

      {/* 6. Social proof — tăng quyết định mua */}
      <ProductSection
        title="Bán chạy nhất"
        subtitle="Danh mục các sản phẩm được khách hàng tin dùng và chọn lựa nhiều nhất"
        products={MOCK_BEST_SELLERS}
        viewAllLink="/products?sort=best_seller"
        bgGray={true}
      />
      <BrandSection brands={MOCK_BRANDS} />
      {/* 7. Voucher sau khi user đã "thèm" sản phẩm */}
      <VoucherZone vouchers={MOCK_HOME_VOUCHERS} />

      {/* 2. Tạo tin tưởng ngay sau banner */}
      <IncentivesBar />
    </main>
  );
}
