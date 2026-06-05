'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  Bell, 
  Layers, 
  Award 
} from 'lucide-react';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { MOCK_CATEGORY_TREE, MOCK_BRANDS } from '../../mocks/homepage.mock';

export default function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // Các State bổ sung cho cấu trúc Menu di động 2 cấp
  const [mobileMenuTab, setMobileMenuTab] = useState<'categories' | 'brands'>('categories');
  const [mobileExpandedParent, setMobileExpandedParent] = useState<number | null>(MOCK_CATEGORY_TREE[0]?.id);

  // Kết nối Zustand Stores
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  // Giả lập 3 thông báo chưa đọc từ bảng notifications của DB để test UI Badge
  const mockUnreadNotifications = 3;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm h-16 select-none">
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* ============================================================
            1. KHU VỰC TRÁI: LOGO & NÚT MENU MOBILE
            ============================================================ */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-slate-600 hover:text-indigo-600 sm:hidden focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link href="/" className="flex items-center gap-1.5 text-slate-900 font-black text-xl tracking-tight">
            <ShoppingBag className="text-indigo-600" size={24} strokeWidth={2.5} />
            <span>Shop<span className="text-indigo-600">Zone</span></span>
          </Link>
        </div>

        {/* ============================================================
            2. KHU VỰC GIỮA: THANH TÌM KIẾM KHÁCH HÀNG (DESKTOP)
            ============================================================ */}
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

        {/* ============================================================
            3. KHU VỰC PHẢI: HỆ THỐNG ICON CHỨC NĂNG & TIỆN ÍCH
            ============================================================ */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Nút tìm kiếm cho điện thoại */}
          <button 
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="p-2 text-slate-600 hover:text-indigo-600 sm:hidden rounded-full hover:bg-slate-100 transition focus:outline-none"
          >
            <Search size={22} />
          </button>

          {/* Icon Chuông Thông Báo — Khớp nối bảng notifications */}
          <Link href="/notifications" className="p-2 text-slate-600 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition relative">
            <Bell size={22} />
            {mounted && mockUnreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-white font-black text-[9px] rounded-full flex items-center justify-center ring-2 ring-white">
                {mockUnreadNotifications}
              </span>
            )}
          </Link>

          {/* Icon Yêu thích Wishlist */}
          <Link href="/wishlist" className="p-2 text-slate-600 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition relative hidden sm:block">
            <Heart size={22} />
          </Link>

          {/* Icon Giỏ hàng Zustand Card Store */}
          <Link href="/cart" className="p-2 text-slate-600 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition relative">
            <ShoppingBag size={22} />
            {mounted && totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white font-black text-[9px] rounded-full flex items-center justify-center ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Khối Hồ sơ & Xác thực tài khoản người dùng */}
          <div className="relative pl-1 border-l border-gray-200 ml-1">
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1 p-0.5 rounded-full hover:bg-slate-100 transition focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-sm flex items-center justify-center border border-indigo-200 overflow-hidden shrink-0">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      user.fullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tài khoản mua sắm</p>
                      <p className="text-sm font-black text-slate-800 truncate mt-0.5">{user.fullName}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition" onClick={() => setIsUserDropdownOpen(false)}>Hồ sơ cá nhân</Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition" onClick={() => setIsUserDropdownOpen(false)}>Quản lý đơn hàng</Link>
                    {user.role !== 'CUSTOMER' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-slate-50 transition" onClick={() => setIsUserDropdownOpen(false)}>Bảng điều khiển Admin</Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 transition"
                    >
                      <LogOut size={14} />
                      <span>Đăng xuất hệ thống</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link 
                href="/login" 
                className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold text-indigo-600 border-2 border-indigo-600 rounded-full hover:bg-indigo-50 transition"
              >
                <User size={14} />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          4. THANH SEARCH DI ĐỘNG DROP-DOWN SLIDE-DOWN
          ============================================================ */}
      {isMobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 p-3 bg-white border-b border-gray-200 flex gap-2 sm:hidden shadow-md animate-in slide-in-from-top duration-200 z-40">
          <input
            type="text"
            placeholder="Tìm thương hiệu, tên sản phẩm..."
            className="w-full px-4 py-2 text-sm text-slate-900 bg-slate-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="px-4 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
            <Search size={18} />
          </button>
        </div>
      )}

      {/* ============================================================
          5. [NÂNG CẤP]: DRAWER DI ĐỘNG ĐA CẤP ĐỒNG BỘ DATAChuẩn API
          ============================================================ */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          <div className="relative flex w-full max-w-xs flex-col bg-white shadow-2xl animate-in slide-in-from-left duration-250 z-50">
            {/* Header của Drawer */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-black text-base text-slate-900 tracking-tight">Khám phá ShopZone</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 p-1"><X size={20} /></button>
            </div>
            
            {/* THANH TABS CHUYỂN ĐỔI GIỮA DANH MỤC VÀ THƯƠNG HIỆU */}
            <div className="grid grid-cols-2 border-b border-gray-100 bg-slate-50 text-center text-xs font-bold text-slate-500">
              <button 
                onClick={() => setMobileMenuTab('categories')}
                className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${mobileMenuTab === 'categories' ? 'bg-white text-indigo-600 border-indigo-600' : 'hover:text-slate-900'}`}
              >
                <Layers size={14} />
                <span>Danh mục</span>
              </button>
              <button 
                onClick={() => setMobileMenuTab('brands')}
                className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${mobileMenuTab === 'brands' ? 'bg-white text-indigo-600 border-indigo-600' : 'hover:text-slate-900'}`}
              >
                <Award size={14} />
                <span>Thương hiệu</span>
              </button>
            </div>

            {/* LÕI NỘI DUNG CUỘN ĐỘNG THEO TAB */}
            <div className="flex-1 overflow-y-auto bg-white">
              
              {/* TAB 1: HIỂN THỊ CÂY DANH MỤC 2 CẤP (ACCORDION STYLE) */}
              {mobileMenuTab === 'categories' && (
                <div className="divide-y divide-gray-50">
                  {MOCK_CATEGORY_TREE.map((parent) => {
                    const isExpanded = mobileExpandedParent === parent.id;
                    return (
                      <div key={parent.id} className="flex flex-col">
                        {/* Nút bấm mở rộng dòng cha cấp 1 */}
                        <button
                          onClick={() => setMobileExpandedParent(isExpanded ? null : parent.id)}
                          className={`w-full px-4 py-3 text-left text-sm font-bold flex items-center justify-between transition ${isExpanded ? 'text-indigo-600 bg-indigo-50/20' : 'text-slate-700 active:bg-slate-50'}`}
                        >
                          <span>{parent.name}</span>
                          <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-indigo-600' : ''}`} />
                        </button>
                        
                        {/* Khối chứa mảng các phần tử con cấp 2 đổ xuống */}
                        {isExpanded && (
                          <div className="bg-slate-50/50 pl-4 border-l-2 border-indigo-500/30 divide-y divide-gray-100/50">
                            {parent.children?.map((child) => (
                              <Link
                                key={child.id}
                                href={`/category/${child.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2.5 text-xs font-semibold text-slate-600 active:text-indigo-600 transition"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: HIỂN THỊ MẢNG THƯƠNG HIỆU ĐỐI TÁC */}
              {mobileMenuTab === 'brands' && (
                <div className="grid grid-cols-2 gap-2 p-3">
                  {MOCK_BRANDS.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/brand/${brand.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-slate-50 border border-gray-100 rounded-lg p-2 flex flex-col items-center justify-center gap-1.5 active:bg-indigo-50/30 transition"
                    >
                      <img src={brand.logo_url} alt={brand.name} className="h-6 object-contain" />
                      <span className="text-[10px] font-bold text-slate-600 truncate max-w-full">{brand.name}</span>
                    </Link>
                  ))}
                </div>
              )}

            </div>

            {/* Khối Footer dưới đáy của Mobile Drawer (Dành cho tài khoản) */}
            <div className="border-t border-gray-100 p-4 bg-slate-50">
              {isAuthenticated && user ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  <LogOut size={14} />
                  <span>Đăng xuất tài khoản</span>
                </button>
              ) : (
                <Link 
                  href="/login" 
                  className="flex w-full justify-center items-center py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đăng nhập ngay
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}