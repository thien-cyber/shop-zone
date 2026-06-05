'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';

export default function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Kết nối Zustand Stores
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  // Khắc phục lỗi Hydration Mismatch bằng cách đợi Component mount lên Client mới hiển thị badge giỏ hàng
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setIsUserDropdownOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm h-16">
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* 1. KHU VỰC LOGO & HAMBURGER (MOBILE) */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-slate-600 hover:text-indigo-600 sm:hidden focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link href="/" className="flex items-center gap-1.5 text-slate-900 font-black text-xl tracking-tight">
            <ShoppingBag className="text-indigo-600" size={24} strokeWidth={2.5} />
            <span>Shop<span className="text-indigo-600">Zone</span></span>
          </Link>
        </div>

        {/* 2. THANH TÌM KIẾM RỘNG Ở GIỮA (DESKTOP) */}
        <div className="hidden sm:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, thương hiệu mong muốn..."
            className="w-full pl-4 pr-12 py-2 text-sm text-slate-900 placeholder-gray-400 bg-slate-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <button className="absolute right-1 top-1 bottom-1 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition">
            <Search size={16} />
          </button>
        </div>

        {/* 3. KHU VỰC ICONS CHỨC NĂNG (RIGHT) */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Nút tìm kiếm phụ cho thiết bị di động */}
          <button 
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="p-2 text-slate-600 hover:text-indigo-600 sm:hidden rounded-full hover:bg-slate-100 transition"
          >
            <Search size={22} />
          </button>

          {/* Wishlist Icon */}
          <Link href="/wishlist" className="p-2 text-slate-600 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition relative hidden sm:block">
            <Heart size={22} />
          </Link>

          {/* Giỏ hàng Icon (Kèm Badge kiểm soát Hydration) */}
          <Link href="/cart" className="p-2 text-slate-600 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition relative">
            <ShoppingBag size={22} />
            {mounted && totalItems > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-bounce">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Auth Section */}
          <div className="relative">
            {isAuthenticated && user ? (
              // Trạng thái: ĐÃ ĐĂNG NHẬP
              <>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center border border-indigo-200 overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      user.fullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
                </button>

                {/* Dropdown Menu điều hướng người dùng */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-slate-400">Xin chào,</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition" onClick={() => setIsUserDropdownOpen(false)}>Tài khoản của tôi</Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition" onClick={() => setIsUserDropdownOpen(false)}>Đơn hàng của tôi</Link>
                    {user.role !== 'CUSTOMER' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-slate-50 transition" onClick={() => setIsUserDropdownOpen(false)}>Trang quản trị</Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 transition"
                    >
                      <LogOut size={14} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Trạng thái: CHƯA ĐĂNG NHẬP
              <Link 
                href="/login" 
                className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-indigo-600 border-2 border-indigo-600 rounded-full hover:bg-indigo-50 transition"
              >
                <User size={16} />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 4. THANH SEARCH DI ĐỘNG THẢ XUỐNG (DROP-DOWN SEARCH MOBILE) */}
      {isMobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 p-3 bg-white border-b border-gray-200 flex gap-2 sm:hidden animate-in slide-in-from-top duration-200">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            className="w-full px-4 py-2 text-sm text-slate-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="px-4 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
            <Search size={18} />
          </button>
        </div>
      )}

      {/* 5. DRAWER MENU DI ĐỘNG SLIDING TỪ BÊN TRÁI (MOBILE SIDE BAR) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          {/* Lớp nền mờ */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          <div className="relative flex w-full max-w-xs flex-col bg-white p-6 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="font-black text-lg text-slate-900">Danh mục ShopZone</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500"><X size={20} /></button>
            </div>
            
            <div className="mt-4 space-y-3 flex-1 overflow-y-auto">
              <Link href="/category/dien-thoai" className="block font-medium text-slate-700 py-1" onClick={() => setIsMobileMenuOpen(false)}>Điện thoại</Link>
              <Link href="/category/laptop" className="block font-medium text-slate-700 py-1" onClick={() => setIsMobileMenuOpen(false)}>Laptop</Link>
              <Link href="/category/thoi-trang" className="block font-medium text-slate-700 py-1" onClick={() => setIsMobileMenuOpen(false)}>Thời trang</Link>
              <Link href="/category/my-pham" className="block font-medium text-slate-700 py-1" onClick={() => setIsMobileMenuOpen(false)}>Mỹ phẩm</Link>
              <Link href="/category/gia-dung" className="block font-medium text-slate-700 py-1" onClick={() => setIsMobileMenuOpen(false)}>Gia dụng</Link>
            </div>

            {!isAuthenticated && (
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <Link 
                  href="/login" 
                  className="flex w-full justify-center items-center py-2.5 bg-indigo-600 text-white font-bold rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đăng nhập tài khoản
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}