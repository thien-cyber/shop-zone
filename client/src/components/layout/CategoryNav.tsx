import React from "react";
import Link from "next/link";
import { MOCK_CATEGORIES } from "../../mocks/homepage.mock";

export default function CategoryNav() {
  return (
    <nav className="sticky top-[64px] z-40 bg-white/95 backdrop-blur border-b border-gray-200/80 shadow-sm hidden sm:block">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          {/* Danh sách danh mục dạng hàng ngang */}
          <div className="flex items-center gap-x-8 overflow-x-auto scrollbar-none whitespace-nowrap py-1">
            {MOCK_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 h-11 flex items-center transition"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Đường dẫn mở rộng */}
          <div className="pl-4 border-l border-gray-200">
            <Link
              href="/categories"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition whitespace-nowrap"
            >
              Xem tất cả →
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
