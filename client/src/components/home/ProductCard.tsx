"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { Product } from "../../mocks/homepage.mock";
import { formatPrice } from "../../lib/format";
import { useCartStore } from "../../store/cart.store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Local state xử lý Yêu thích (Optimistic Update giả lập)
  const [isWishlisted, setIsWishlisted] = useState(false);
  // Local state xử lý animation bounce của nút Thêm vào giỏ
  const [isBouncing, setIsBouncing] = useState(false);

  // Hàm render số sao vàng/xám chuẩn xác theo điểm avg_rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-200"
        }
      />
    ));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn hành vi click thẻ Card bọc Link nhảy sang trang chi tiết
    setIsBouncing(true);

    // Giả lập map dữ liệu SKU mẫu từ Product Model xuống Cart Item 구조
    addItem(
      {
        skuId: `sku-${product.id}`,
        productId: product.id,
        name: product.name,
        skuCode: `${product.slug.toUpperCase()}-STD`,
        price: product.min_price,
        image: product.thumbnail_url,
        stock: 99, // Tồn kho giả định lớn để test tăng số lượng thoải mái
        attributes: { "Phiên bản": "Tiêu chuẩn" },
      },
      1,
    );

    // Tắt class animation sau 150ms để có thể click tiếp lần sau
    setTimeout(() => {
      setIsBouncing(false);
    }, 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group relative bg-white border border-gray-200/60 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex flex-col h-full">
      {/* 1. KHU VỰC HÌNH ẢNH & OVERLAY HOVER */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        {/* Nút Yêu thích (Wishlist Icon góc phải trên) */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2.5 right-2.5 z-20 p-2 bg-white/80 backdrop-blur-xs rounded-full text-slate-400 hover:text-red-500 hover:scale-110 shadow-xs transition-all duration-200 focus:outline-none"
        >
          <Heart
            size={18}
            className={
              isWishlisted ? "text-red-500 fill-red-500 animate-ping-once" : ""
            }
          />
        </button>

        {/* Thẻ ảnh sản phẩm gốc */}
        <img
          src={product.thumbnail_url}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Lớp nền mờ + Nút xem nhanh xuất hiện khi Hover chuột (Desktop) */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center hidden md:flex">
          <Link
            href={`/product/${product.slug}`}
            className="px-4 py-2 bg-white/95 backdrop-blur-xs text-slate-800 font-bold text-xs rounded-full shadow flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white"
          >
            <Eye size={14} />
            <span>Xem chi tiết</span>
          </Link>
        </div>
      </div>

      {/* 2. KHU VỰC THÔNG TIN NGHIỆP VỤ (BODY CARD) */}
      <div className="p-3.5 flex flex-col flex-1 space-y-2">
        {/* Đường dẫn text nhảy thẳng vào trang chi tiết sản phẩm */}
        <Link
          href={`/product/${product.slug}`}
          className="block flex-1 group-hover:text-indigo-600 transition-colors"
        >
          <h4 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 min-h-[40px]">
            {product.name}
          </h4>
        </Link>

        {/* Khối đánh giá số sao (Rating System Row) */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {renderStars(product.avg_rating)}
          </div>
          <span className="text-[11px] font-medium text-slate-400 mt-0.5">
            ({product.review_count})
          </span>
        </div>

        {/* Hàng chứa giá tiền và nút hành động Add to cart */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-900 tracking-tight">
              {formatPrice(product.min_price)}
            </span>
            {product.max_price > product.min_price && (
              <span className="text-[10px] font-medium text-slate-400">
                Đến {formatPrice(product.max_price)}
              </span>
            )}
          </div>

          {/* Nút bấm Thêm vào giỏ (Kèm hiệu ứng scale nảy khi click) */}
          <button
            onClick={handleAddToCart}
            disabled={isBouncing}
            className={`p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm hover:shadow focus:outline-none flex items-center justify-center relative overflow-hidden ${
              isBouncing
                ? "bg-emerald-600 hover:bg-emerald-600 scale-95"
                : "active:scale-95"
            }`}
            title="Thêm nhanh vào giỏ hàng"
          >
            {isBouncing ? (
              <span className="text-xs font-bold px-1 animate-fade-in">
                ✓ Đã thêm
              </span>
            ) : (
              <ShoppingCart size={16} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
