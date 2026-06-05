"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Star, ShoppingCart } from "lucide-react";
import { FlashSale } from "../../mocks/homepage.mock";
import { formatPrice } from "../../lib/format";
import { useCartStore } from "../../store/cart.store";

interface FlashSaleSectionProps {
  flashSale: FlashSale;
}

export default function FlashSaleSection({ flashSale }: FlashSaleSectionProps) {
  const addItem = useCartStore((state) => state.addItem);

  // 1. Logic State quản lý Countdown bộ đếm thời gian
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

    // Khởi tạo giá trị ban đầu tránh độ trễ 1 giây của setInterval
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSale.end_time]);

  // Hàm tiện ích đệm số 0 phía trước (Ví dụ: 9 -> "09")
  const padZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

  // 2. Logic xử lý Thêm sản phẩm Flash Sale vào giỏ hàng
  const handleAddFlashSaleToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    addItem(
      {
        skuId: `sku-${item.product.id}`,
        productId: item.product.id,
        name: item.product.name,
        skuCode: `${item.product.slug.toUpperCase()}-FS`,
        price: item.flash_price, // Áp dụng giá Flash Sale ưu đãi sâu
        image: item.product.thumbnail_url,
        stock: item.sale_quantity_limit - item.sold_count, // Tồn kho thực tế của Flash Sale còn lại
        attributes: { "Chương trình": "Flash Sale Giờ Vàng" },
      },
      1,
    );
  };

  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION: Tiêu đề và Đồng hồ đếm ngược */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-red-600 font-black text-lg sm:text-xl tracking-tight uppercase">
              <Flame size={24} className="fill-red-600 animate-pulse" />
              <span>Flash Sale</span>
            </div>

            {/* Khối hiển thị Đồng hồ số hộp đỏ vuông chữ trắng */}
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
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
          >
            Xem tất cả deal sốc →
          </Link>
        </div>

        {/* LƯỚI SẢN PHẨM: Scroll ngang tự động bắt dính trên Mobile, hiển thị 4 cột cứng trên Desktop */}
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
          {flashSale.items.map((item) => {
            // Tính toán % tiến độ số lượng đã bán thực tế
            const percentSold = Math.round(
              (item.sold_count / item.sale_quantity_limit) * 100,
            );
            // Tính toán % giảm giá sâu của mặt hàng Flash Sale
            const discountPercent = Math.round(
              (1 - item.flash_price / item.original_price) * 100,
            );

            return (
              <div
                key={item.id}
                className="w-[260px] flex-shrink-0 snap-start bg-white border border-gray-200 rounded-xl p-3 flex flex-col hover:border-red-300 hover:shadow-md transition-all duration-300 md:w-full"
              >
                {/* 1. KHUNG ẢNH CÓ BADGE PHẦN TRĂM GIẢM GIÁ */}
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

                {/* 2. NỘI DUNG THÔNG TIN CHI TIẾT SẢN PHẨM */}
                <div className="flex flex-col flex-1 space-y-2">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="block"
                  >
                    <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px] hover:text-red-600 transition-colors leading-snug">
                      {item.product.name}
                    </h4>
                  </Link>

                  {/* Rating row */}
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Star
                      size={12}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="font-bold text-slate-700">
                      {item.product.avg_rating}
                    </span>
                    <span>({item.product.review_count} đánh giá)</span>
                  </div>

                  {/* Khối hiển thị Giá bán Flash sale so với Giá gốc ban đầu */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-black text-red-600 tracking-tight">
                      {formatPrice(item.flash_price)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(item.original_price)}
                    </span>
                  </div>

                  {/* THANH TIẾN TRÌNH PROGRESS BAR BÁO LƯỢNG HÀNG BÁN GẤP */}
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden relative border border-gray-200/40">
                      <div
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full transition-all duration-500"
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

                  {/* NÚT HÀNH ĐỘNG THÊM VÀO GIỎ SẮC ĐỎ NỔI BẬT */}
                  <button
                    onClick={(e) => handleAddFlashSaleToCart(e, item)}
                    disabled={
                      isEnded || item.sold_count >= item.sale_quantity_limit
                    }
                    className="w-full mt-2 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 active:scale-98 disabled:bg-gray-300 disabled:text-gray-500 disabled:pointer-events-none transition"
                  >
                    <ShoppingCart size={14} strokeWidth={2.5} />
                    <span>
                      {item.sold_count >= item.sale_quantity_limit
                        ? "Hết hàng sale"
                        : "Mua ngay với giá sốc"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
