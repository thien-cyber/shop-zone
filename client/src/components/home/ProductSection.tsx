import React from "react";
import Link from "next/link";
import { Product } from "../../mocks/homepage.mock";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink: string;
  bgGray?: boolean;
}

export default function ProductSection({
  title,
  subtitle,
  products,
  viewAllLink,
  bgGray = false,
}: ProductSectionProps) {
  // Thực hiện Hard Limit cắt đúng tối đa 8 bản ghi lên màn hình
  const LIMIT = 8;
  const displayedProducts = products.slice(0, LIMIT);
  const hasMore = products.length > LIMIT;

  return (
    <section
      className={`py-12 sm:py-16 border-b border-gray-100 ${bgGray ? "bg-slate-50/70" : "bg-white"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-l-4 border-indigo-600 pl-3">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href={viewAllLink}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 whitespace-nowrap group transition"
          >
            <span>Xem tất cả </span>
            <span className="inline-block transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-3 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {displayedProducts.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Nút bấm lớn căn giữa xuất hiện khi lượng hàng vượt quá 8 */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <Link
              href={viewAllLink}
              className="px-8 py-2.5 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-full text-sm font-bold shadow-xs transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Xem tất cả {products.length} sản phẩm mục này
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
