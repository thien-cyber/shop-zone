"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "../../mocks/homepage.mock";

interface HeroBannerProps {
  banners: Banner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  // Kích hoạt bộ đếm thời gian Auto-slide 4 giây
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 4000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[220px] sm:h-[320px] md:h-[420px] bg-slate-100 overflow-hidden group">
      {/* 1. KHU VỰC HIỂN THỊ SLIDES */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
            index === currentSlide
              ? "opacity-100 z-10 scale-100"
              : "opacity-0 z-0 scale-95"
          }`}
        >
          {/* Hình nền fill full-screen */}
          <Image
            src={banner.image_url}
            alt={banner.title}
            fill
            priority={index === 0}
            className="object-cover object-center"
            sizes="100vw"
          />

          {/* Lớp phủ Gradient đen mờ tăng độ tương phản đọc chữ */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent z-11"></div>

          {/* Nội dung Banner đè lên lớp phủ */}
          <div className="absolute inset-0 z-12 mx-auto max-w-7xl h-full px-6 sm:px-8 lg:px-12 flex flex-col justify-center items-start text-white space-y-2 md:space-y-4">
            <span className="bg-indigo-600/90 backdrop-blur-xs text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
              Ưu đãi đặc biệt
            </span>
            <h2 className="text-xl sm:text-3xl md:text-5xl font-black max-w-xl leading-tight drop-shadow-sm">
              {banner.title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-md font-medium leading-relaxed hidden sm:block">
              {banner.subtitle}
            </p>
            <div className="pt-1 sm:pt-2">
              <Link
                href={banner.link_url}
                className="inline-flex bg-white text-indigo-700 font-bold text-xs sm:text-sm px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {banner.cta_text}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* 2. ĐIỀU HƯỚNG: NÚT PREV / NEXT (CHỈ HIỂN THỊ TRÊN DESKTOP KHI HOVER BANNER) */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow"
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow"
      >
        <ChevronRight size={22} strokeWidth={2.5} />
      </button>

      {/* 3. ĐIỀU HƯỚNG: CÁC DẤU CHẤM TRÒN BOTTOM (DOTS CHỈ BÁO SLIDE ACTIVE) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
              index === currentSlide
                ? "w-6 bg-indigo-600 shadow-xs"
                : "w-2 bg-white/60 hover:bg-white"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
