"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Star, ShoppingCart, ArrowRight } from "lucide-react";
import { FlashSale } from "../../mocks/homepage.mock";
import { formatPrice } from "../../lib/format";
import { useCartStore } from "../../store/cart.store";

interface FlashSaleSectionProps {
  flashSale: FlashSale;
}

export default function FlashSaleSection({ flashSale }: FlashSaleSectionProps) {
  const addItem = useCartStore((state) => state.addItem);

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(flashSale.end_time).getTime() - Date.now();
      if (difference <= 0) {
        setIsEnded(true);
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [flashSale.end_time]);

  const padZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

  const handleAddFlashSaleToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    addItem(
      {
        skuId: `sku-${item.product.id}`,
        productId: item.product.id,
        name: item.product.name,
        skuCode: `${item.product.slug.toUpperCase()}-FS`,
        price: item.flash_price,
        image: item.product.thumbnail_url,
        stock: item.sale_quantity_limit - item.sold_count,
        attributes: { "Chương trình": "Flash Sale Giờ Vàng" },
      },
      1,
    );
  };

  // Cấu hình giới hạn số lượng hiển thị
  const LIMIT = 4;
  const displayedItems = flashSale.items.slice(0, LIMIT);
  const remainingCount = flashSale.items.length - LIMIT;

  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-red-600 font-black text-lg sm:text-xl tracking-tight uppercase">
              <Flame size={24} className="fill-red-600 animate-pulse" />
              <span>Flash Sale</span>
            </div>

            {!isEnded ? (
              <div className="flex items-center gap-1.5 select-none">
                <span className="bg-red-600 text-white text-xs sm:text-sm font-mono font-bold px-2 py-1 rounded-md shadow-xs">
                  {padZero(timeLeft.hours)}
                </span>
                <span className="text-red-600 font-bold">:</span>
                <span className="bg-red-600 text-white text-xs sm:text-sm font-mono font-bold px-2 py-1 rounded-md shadow-xs">
                  {padZero(timeLeft.minutes)}
                </span>
                <span className="text-red-600 font-bold">:</span>
                <span className="bg-red-600 text-white text-xs sm:text-sm font-mono font-bold px-2 py-1 rounded-md shadow-xs">
                  {padZero(timeLeft.seconds)}
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-2.5 py-1 rounded">
                Đã kết thúc
              </span>
            )}
          </div>

          <Link
            href="/flash-sale"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            Xem tất cả deal sốc →
          </Link>
        </div>

        {/* LƯỚI SẢN PHẨM FLASH SALE */}
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
          {displayedItems.map((item) => {
            const percentSold = Math.round(
              (item.sold_count / item.sale_quantity_limit) * 100,
            );
            const discountPercent = Math.round(
              (1 - item.flash_price / item.original_price) * 100,
            );

            return (
              <div
                key={item.id}
                className="w-[260px] flex-shrink-0 snap-start bg-white border border-gray-200 rounded-xl p-3 flex flex-col hover:border-red-300 hover:shadow-md transition-all duration-300 md:w-full"
              >
                <div className="relative aspect-square w-full rounded-lg bg-slate-50 overflow-hidden mb-3">
                  <span className="absolute top-2 left-2 z-10 bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded-md shadow-sm">
                    -{discountPercent}%
                  </span>
                  <img
                    src={item.product.thumbnail_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>

                <div className="flex flex-col flex-1 space-y-2">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="block"
                  >
                    <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px] hover:text-red-600 transition-colors leading-snug">
                      {item.product.name}
                    </h4>
                  </Link>

                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Star
                      size={12}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="font-bold text-slate-700">
                      {item.product.avg_rating}
                    </span>
                    <span>({item.product.review_count})</span>
                  </div>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-black text-red-600 tracking-tight">
                      {formatPrice(item.flash_price)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(item.original_price)}
                    </span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden relative border border-gray-200/40">
                      <div
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full"
                        style={{ width: `${percentSold}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                      <span>
                        🔥 Đã bán {item.sold_count}/{item.sale_quantity_limit}
                      </span>
                      <span className="text-red-600">{percentSold}%</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleAddFlashSaleToCart(e, item)}
                    disabled={
                      isEnded || item.sold_count >= item.sale_quantity_limit
                    }
                    className="w-full mt-2 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition disabled:bg-gray-300"
                  >
                    <ShoppingCart size={14} strokeWidth={2.5} />
                    <span>
                      {item.sold_count >= item.sale_quantity_limit
                        ? "Hết hàng"
                        : "Mua ngay"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Thẻ báo hiệu "Còn nữa" xuất hiện ở cuối danh sách dành cho Mobile/Tablet */}
          {remainingCount > 0 && (
            <Link
              href="/flash-sale"
              className="w-[180px] flex-shrink-0 snap-start bg-slate-50 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center p-4 group hover:bg-red-50/30 hover:border-red-300 transition md:hidden"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ArrowRight size={20} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-slate-800">Xem thêm</span>
              <span className="text-xs font-semibold text-red-600 mt-1">
                +{remainingCount} sản phẩm deal sốc
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
