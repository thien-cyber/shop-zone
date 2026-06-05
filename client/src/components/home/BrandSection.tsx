import React from 'react';
import Link from 'next/link';
import { Brand } from '../../mocks/homepage.mock';

interface BrandSectionProps {
  brands: Brand[];
}

export default function BrandSection({ brands }: BrandSectionProps) {
  return (
    <section className="bg-slate-50/50 py-10 sm:py-14 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Tiêu đề Section */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-wider">
            Thương hiệu đối tác chính hãng
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            ShopZone cam kết 100% sản phẩm có nguồn gốc xuất xứ chính thống từ các tập đoàn phân phối toàn cầu
          </p>
        </div>

        {/* Lưới phân bổ thương hiệu: Chuyển sang flex-col để xếp chồng Logo và Chữ */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-2 aspect-[1/1] sm:aspect-[4/3] overflow-hidden group transition-all duration-300 hover:border-indigo-400 hover:shadow-md focus:outline-none"
            >
              {/* Khung chứa ảnh thương hiệu — Đã loại bỏ hoàn toàn bộ lọc grayscale để giữ màu gốc */}
              <div className="h-10 w-full flex items-center justify-center">
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              {/* [BỔ SUNG NEW]: Nhãn văn bản hiển thị tên thương hiệu rõ ràng bên dưới */}
              <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors duration-200 text-center truncate w-full px-1">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}