import React from "react";
import Link from "next/link";
import { Category } from "../../mocks/homepage.mock";

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="bg-white py-10 sm:py-14 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề Section */}
        <div className="flex items-center justify-between mb-8 border-l-4 border-indigo-600 pl-3">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Danh mục nổi bật
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
              Khám phá hệ sinh thái sản phẩm phong phú phân loại theo ngành hàng
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 transition"
          >
            Xem tất cả ngành hàng →
          </Link>
        </div>

        {/* Lưới phân bổ 8 danh mục nổi bật */}
        <div className="grid grid-cols-4 gap-y-8 gap-x-3 sm:gap-x-6 md:grid-cols-8 lg:gap-x-8">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center group focus:outline-none"
            >
              {/* Khung chứa ảnh tròn và các hiệu ứng Transform khi Hover */}
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-gray-100 bg-slate-50 flex items-center justify-center overflow-hidden transition-all duration-300 transform group-hover:scale-105 group-hover:border-indigo-400 group-hover:shadow-md">
                <img
                  src={category.thumbnail_url}
                  alt={category.name}
                  className="w-full h-full object-cover transition duration-500 group-hover:rotate-1"
                  loading="lazy"
                />
              </div>

              {/* Nhãn nhan đề văn bản hiển thị tên danh mục */}
              <span className="text-xs sm:text-sm font-semibold text-slate-700 text-center mt-2.5 group-hover:text-indigo-600 transition truncate max-w-full px-1">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
