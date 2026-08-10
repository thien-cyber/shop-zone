"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Ticket, Check, ChevronDown } from "lucide-react";
import { HomeVoucher } from "../../mocks/homepage.mock";
import { formatPrice } from "../../lib/format";

interface VoucherZoneProps {
  vouchers: HomeVoucher[];
}

export default function VoucherZone({ vouchers }: VoucherZoneProps) {
  const [savedVouchers, setSavedVouchers] = useState<string[]>([]);

  const handleSaveVoucher = (id: string) => {
    if (savedVouchers.includes(id)) return;
    setSavedVouchers([...savedVouchers, id]);
  };

  const LIMIT = 3;
  const displayedVouchers = vouchers.slice(0, LIMIT);
  const remainingCount = vouchers.length - LIMIT;

  return (
    <section className="py-10 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8 border-l-4 border-amber-400 pl-3">
          <Ticket className="text-amber-400" size={24} />
          <div>
            <h3 className="text-lg font-black tracking-tight text-white uppercase">
              Trạm Săn Voucher Độc Quyền
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Thu thập mã giảm giá ngay để được áp dụng tự động tại bước thanh
              toán hóa đơn đơn hàng
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {displayedVouchers.map((voucher) => {
            const isSaved = savedVouchers.includes(voucher.id);
            return (
              <div
                key={voucher.id}
                className="bg-white text-slate-800 rounded-xl overflow-hidden shadow-lg flex border-2 border-dashed border-slate-200 relative group transition hover:border-amber-400"
              >
                <div className="bg-amber-400 text-slate-900 p-4 flex flex-col justify-center items-center font-black w-24 text-center select-none shrink-0">
                  <span className="text-sm">GIẢM</span>
                  <span className="text-lg leading-none mt-1">
                    {voucher.discount_type === "PERCENTAGE"
                      ? `${voucher.discount_value}%`
                      : `${voucher.discount_value / 1000}K`}
                  </span>
                </div>

                <div className="p-3.5 flex flex-col justify-center flex-1 overflow-hidden">
                  <span className="text-xs bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-md w-fit mb-1 border border-slate-200">
                    CODE: {voucher.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                    {voucher.desc}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Đơn tối thiểu: {formatPrice(voucher.min_order_value)}
                  </p>
                </div>

                <div className="p-3 flex items-center justify-center border-l border-dashed border-gray-200 shrink-0">
                  <button
                    onClick={() => handleSaveVoucher(voucher.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-xs transition-all duration-200 ${
                      isSaved
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 group-hover:scale-105"
                    }`}
                  >
                    {isSaved ? (
                      <span className="flex items-center gap-1">
                        <Check size={12} strokeWidth={3} /> Đã lưu
                      </span>
                    ) : (
                      "Lưu mã"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Liên kết text nhảy về trung tâm Voucher của Sàn */}
        {remainingCount > 0 && (
          <div className="mt-6 flex justify-center">
            <Link
              href="/vouchers"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Xem thêm {remainingCount} mã giảm giá hấp dẫn khác</span>
              <ChevronDown size={14} className="animate-bounce mt-0.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
