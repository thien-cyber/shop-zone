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
  return (
    <section
      className={`py-12 sm:py-16 border-b border-gray-100 ${bgGray ? "bg-slate-50/70" : "bg-white"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Thanh tiêu đề khối điều hướng */}
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

        {/* Lưới sản phẩm Responsive: Mobile 2 cột, Tablet 3 cột, Desktop 4 cột */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-3 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
