import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Brand } from '../../mocks/homepage.mock';

interface BrandSectionProps {
  brands: Brand[];
}

export default function BrandSection({ brands }: BrandSectionProps) {
  const LIMIT = 8;
  const hasMore = brands.length > LIMIT;
  
  // Thuật toán: Nếu nhiều hơn 8, bốc 7 thằng đầu và nhường ô số 8 làm khối "Xem thêm"
  const displayedBrands = hasMore ? brands.slice(0, LIMIT - 1) : brands.slice(0, LIMIT);
  const remainingBrandsCount = brands.length - displayedBrands.length;

  return (
    <section className="bg-slate-50/50 py-10 sm:py-14 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-wider">Thương hiệu đối tác chính hãng</h3>
          <p className="text-xs text-slate-400 mt-1">ShopZone cam kết 100% sản phẩm có nguồn gốc xuất xứ chính thống từ các tập đoàn phân phối toàn cầu</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {displayedBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-2 aspect-[1/1] sm:aspect-[4/3] overflow-hidden group transition-all duration-300 hover:border-indigo-400 hover:shadow-md focus:outline-none"
            >
              <div className="h-10 w-full flex items-center justify-center">
                <img src={brand.logo_url} alt={brand.name} className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              </div>
              <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors duration-200 text-center truncate w-full px-1">
                {brand.name}
              </span>
            </Link>
          ))}

          {/* [HÀNH ĐỘNG MỚI]: Thẻ Card thứ 8 giữ chỗ lưới cân bằng tuyệt đối */}
          {hasMore && (
            <Link
              href="/brands"
              className="bg-indigo-50 border border-dashed border-indigo-300 rounded-xl p-3 flex flex-col items-center justify-center gap-1 aspect-[1/1] sm:aspect-[4/3] group hover:bg-indigo-600 hover:border-transparent transition-all duration-300 text-center"
            >
              <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Plus size={16} strokeWidth={3} />
              </div>
              <span className="text-xs font-black text-indigo-700 group-hover:text-white transition-colors">
                +{remainingBrandsCount} Hãng khác
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}