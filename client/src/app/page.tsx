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
      <HeroBanner banners={MOCK_BANNERS} />

      <FlashSaleSection flashSale={MOCK_FLASH_SALE} />

      <CategorySection categories={MOCK_CATEGORIES} />

      <ProductSection
        title="Sản phẩm mới nhất"
        subtitle="Cập nhật xu hướng công nghệ và thời trang đi đầu hệ thống"
        products={MOCK_NEW_PRODUCTS}
        viewAllLink="/products?sort=newest"
      />

      <ProductSection
        title="Bán chạy nhất"
        subtitle="Danh mục các sản phẩm được khách hàng tin dùng và chọn lựa nhiều nhất"
        products={MOCK_BEST_SELLERS}
        viewAllLink="/products?sort=best_seller"
        bgGray={true}
      />

      <BrandSection brands={MOCK_BRANDS} />

      <VoucherZone vouchers={MOCK_HOME_VOUCHERS} />

      <IncentivesBar />
    </main>
  );
}
