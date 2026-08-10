"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Layers, Award, ArrowRight } from "lucide-react";
import { MOCK_CATEGORY_TREE, MOCK_BRANDS } from "../../mocks/homepage.mock";

export default function CategoryNav() {
  // Quản lý trạng thái đóng mở panel dropdown cấp 2 dựa theo thẻ đang được Hover
  const [activeMenu, setActiveMenu] = useState<"categories" | "brands" | null>(
    null,
  );
  // Quản lý danh mục cha tầng 1 đang được trỏ tới bên trong cụm Danh mục
  const [selectedParentCategory, setSelectedParentCategory] = useState<number>(
    MOCK_CATEGORY_TREE[0]?.id,
  );

  const currentSubCategories =
    MOCK_CATEGORY_TREE.find((cat) => cat.id === selectedParentCategory)
      ?.children || [];

  return (
    <nav
      className="sticky top-[64px] z-40 bg-white border-b border-gray-200 shadow-xs hidden sm:block select-none"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-8 h-12">
          {/* CẤP 1 - NÚT ĐIỀU HƯỚNG DANH MỤC SẢN PHẨM */}
          <div
            className="h-full"
            onMouseEnter={() => setActiveMenu("categories")}
          >
            <button
              className={`flex items-center gap-1 text-sm font-bold h-full border-b-2 transition focus:outline-none ${
                activeMenu === "categories"
                  ? "text-indigo-600 border-indigo-600"
                  : "text-slate-700 border-transparent hover:text-indigo-600"
              }`}
            >
              <Layers size={16} />
              <span>Danh mục sản phẩm</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${activeMenu === "categories" ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* CẤP 1 - NÚT ĐIỀU HƯỚNG THƯƠNG HIỆU ĐỐI TÁC */}
          <div className="h-full" onMouseEnter={() => setActiveMenu("brands")}>
            <button
              className={`flex items-center gap-1 text-sm font-bold h-full border-b-2 transition focus:outline-none ${
                activeMenu === "brands"
                  ? "text-indigo-600 border-indigo-600"
                  : "text-slate-700 border-transparent hover:text-indigo-600"
              }`}
            >
              <Award size={16} />
              <span>Thương hiệu nổi bật</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${activeMenu === "brands" ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2.1 BẢNG CHỨA CẤU TRÚC DANH MỤC ĐA CẤP (ADJACENCY TREE BẢNG CATEGORIES) */}
      {activeMenu === "categories" && (
        <div className="absolute top-12 left-0 right-0 bg-white border-b border-gray-200 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
          <div className="mx-auto max-w-7xl grid grid-cols-4 min-h-[280px]">
            {/* Cột trái rộng 1/4: Danh sách các Danh mục gốc tầng 1 (parent_id IS NULL) */}
            <div className="col-span-1 bg-slate-50 border-r border-gray-100 py-4">
              {MOCK_CATEGORY_TREE.map((category) => (
                <div
                  key={category.id}
                  onMouseEnter={() => setSelectedParentCategory(category.id)}
                  className={`w-full text-left px-6 py-2.5 text-sm font-bold flex items-center justify-between cursor-pointer transition ${
                    selectedParentCategory === category.id
                      ? "bg-white text-indigo-600 border-l-4 border-indigo-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span>{category.name}</span>
                  <ArrowRight
                    size={14}
                    className={
                      selectedParentCategory === category.id
                        ? "opacity-100"
                        : "opacity-0"
                    }
                  />
                </div>
              ))}
            </div>

            {/* Cột phải rộng 3/4: Lưới chứa toàn bộ Danh mục con tầng 2 thuộc danh mục đang chọn */}
            <div className="col-span-3 p-6 bg-white grid grid-cols-3 gap-6 content-start">
              {currentSubCategories.length > 0 ? (
                currentSubCategories.map((subCategory) => (
                  <Link
                    key={subCategory.id}
                    href={`/category/${subCategory.slug}`}
                    onClick={() => setActiveMenu(null)}
                    className="flex flex-col p-3 rounded-lg border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/20 transition group"
                  >
                    <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition">
                      {subCategory.name}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 group-hover:text-slate-500 transition">
                      Khám phá sản phẩm →
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-400 col-span-3 italic">
                  Ngành hàng này đang được cập nhật sản phẩm con.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeMenu === "brands" && (
        <div className="absolute top-12 left-0 right-0 bg-white border-b border-gray-200 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
          <div className="mx-auto max-w-7xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Thương hiệu phân phối độc quyền
              </span>
              <Link
                href="/brands"
                onClick={() => setActiveMenu(null)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Xem tất cả hãng gia nhập →
              </Link>
            </div>

            {/* Lưới Logo 8 thương hiệu */}
            <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
              {MOCK_BRANDS.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brand/${brand.slug}`}
                  onClick={() => setActiveMenu(null)}
                  className="bg-slate-50 border border-gray-200 rounded-lg p-2 flex flex-col items-center justify-center gap-1 aspect-[4/3] group hover:border-indigo-400 hover:bg-white hover:shadow-xs transition"
                >
                  <div className="h-8 w-full flex items-center justify-center">
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain transition-transform group-hover:scale-102"
                    />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-indigo-600 transition-colors truncate w-full text-center px-0.5">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
