// Core TypeScript Interfaces matching Backend Models
export interface Banner {
  id: string;
  image_url: string;
  link_url: string;
  title: string;
  subtitle: string;
  cta_text: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  thumbnail_url: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  thumbnail_url: string;
  min_price: number;
  max_price: number;
  avg_rating: number;
  review_count: number;
}

export interface FlashSaleItem {
  id: string;
  product: Product;
  flash_price: number;
  original_price: number;
  sale_quantity_limit: number;
  sold_count: number;
  reserved_count: number;
}

export interface FlashSale {
  id: string;
  name: string;
  end_time: string; // ISO string expiration
  items: FlashSaleItem[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
}

export interface HomeVoucher {
  id: string;
  code: string;
  discount_type: "PERCENTAGE" | "FIXED_AMOUNT";
  discount_value: number;
  min_order_value: number;
  desc: string;
}

export interface NestedCategory {
  id: number;
  name: string;
  slug: string;
  children?: NestedCategory[]; // Đệ quy chứa các danh mục con cấp 2
}

export interface CategoryNode extends Category {
  children?: Category[];
}

// ============================================================
// EXPORTED MOCK DATA USING SEEDED PLACEHOLDERS
// ============================================================

export const MOCK_NESTED_CATEGORIES: NestedCategory[] = [
  {
    id: 1,
    name: "Thiết Bị Điện Tử",
    slug: "thiet-bi-dien-tu",
    children: [
      { id: 11, name: "Điện thoại Smartphone", slug: "smartphone" },
      { id: 12, name: "Máy tính bảng Tablet", slug: "tablet" },
      { id: 13, name: "Phụ kiện công nghệ", slug: "phu-kien-cong-nghe" },
      { id: 14, name: "Loa & Tai nghe", slug: "loa-tai-nghe" },
    ],
  },
  {
    id: 2,
    name: "Máy Tính & Laptop",
    slug: "may-tinh-laptop",
    children: [
      { id: 21, name: "Laptop Văn Phòng", slug: "laptop-van-phong" },
      { id: 22, name: "Laptop Gaming", slug: "laptop-gaming" },
      { id: 23, name: "Linh kiện PC", slug: "linh-kien-pc" },
      { id: 24, name: "Màn hình máy tính", slug: "man-hinh" },
    ],
  },
  {
    id: 3,
    name: "Thời Trang Nam & Nữ",
    slug: "thoi-trang",
    children: [
      { id: 31, name: "Áo thun & Áo sơ mi", slug: "ao-nam-nu" },
      { id: 32, name: "Quần Jeans & Kaki", slug: "quan-nam-nu" },
      { id: 33, name: "Giày thể thao Sneaker", slug: "giay-the-thao" },
      { id: 34, name: "Túi xách & Ví da", slug: "tui-xach-vi" },
    ],
  },
  {
    id: 4,
    name: "Sức Khỏe & Sắc Đẹp",
    slug: "suc-khoe-sac-dep",
    children: [
      { id: 41, name: "Chăm sóc da mặt", slug: "cham-soc-da-mat" },
      { id: 42, name: "Trang điểm Make-up", slug: "trang-diem" },
      { id: 43, name: "Nước hoa chính hãng", slug: "nuoc-hoa" },
      { id: 44, name: "Thực phẩm chức năng", slug: "thuc-pham-chuc-nang" },
    ],
  },
];

export const MOCK_BANNERS: Banner[] = [
  {
    id: "b1",
    image_url:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070",
    link_url: "/products?collection=mega-sale",
    title: "Siêu Sale Công Nghệ 2026",
    subtitle: "Bùng nổ ưu đãi lên đến 50% tất cả các dòng Flagship mới nhất.",
    cta_text: "Mua Ngay",
  },
  {
    id: "b2",
    image_url:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
    link_url: "/products?category=fashion",
    title: "Xu Hướng Thời Trang Hè",
    subtitle:
      "Đón đầu phong cách trẻ trung, năng động với bộ sưu tập độc quyền.",
    cta_text: "Khám Phá",
  },
  {
    id: "b3",
    image_url:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070",
    link_url: "/vouchers",
    title: "Đặc Quyền Thành Viên Mới",
    subtitle:
      "Đăng ký tài khoản ShopZone hôm nay, nhận ngay combo voucher 500.000đ.",
    cta_text: "Nhận Mã Giảm Giá",
  },
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Điện thoại",
    slug: "dien-thoai",
    thumbnail_url: "https://picsum.photos/seed/phone/200/200",
  },
  {
    id: 2,
    name: "Laptop",
    slug: "laptop",
    thumbnail_url: "https://picsum.photos/seed/laptop/200/200",
  },
  {
    id: 3,
    name: "Thời trang",
    slug: "thoi-trang",
    thumbnail_url: "https://picsum.photos/seed/fashion/200/200",
  },
  {
    id: 4,
    name: "Mỹ phẩm",
    slug: "my-pham",
    thumbnail_url: "https://picsum.photos/seed/cosmetics/200/200",
  },
  {
    id: 5,
    name: "Gia dụng",
    slug: "gia-dung",
    thumbnail_url: "https://picsum.photos/seed/home/200/200",
  },
  {
    id: 6,
    name: "Thể thao",
    slug: "the-thao",
    thumbnail_url: "https://picsum.photos/seed/sports/200/200",
  },
  {
    id: 7,
    name: "Sách",
    slug: "sach",
    thumbnail_url: "https://picsum.photos/seed/books/200/200",
  },
  {
    id: 8,
    name: "Đồ chơi",
    slug: "do-choi",
    thumbnail_url: "https://picsum.photos/seed/toys/200/200",
  },
];

export const MOCK_FLASH_SALE: FlashSale = {
  id: "fs-1",
  name: "Flash Sale Giờ Vàng",
  // Tự động thiết lập thời gian kết thúc là 2 tiếng kể từ thời điểm render hiện tại
  end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  items: [
    {
      id: "fsi-1",
      flash_price: 18990000,
      original_price: 24990000,
      sale_quantity_limit: 50,
      sold_count: 42,
      reserved_count: 3,
      product: {
        id: "p-fs1",
        name: "iPhone 15 Pro 128GB - Chính hãng VN/A",
        slug: "iphone-15-pro-128gb",
        thumbnail_url: "https://picsum.photos/seed/iphone15/500/500",
        min_price: 24990000,
        max_price: 24990000,
        avg_rating: 4.8,
        review_count: 156,
      },
    },
    {
      id: "fsi-2",
      flash_price: 14500000,
      original_price: 19990000,
      sale_quantity_limit: 20,
      sold_count: 18,
      reserved_count: 1,
      product: {
        id: "p-fs2",
        name: "Laptop Asus Vivobook 14 OLED Core i5",
        slug: "laptop-asus-vivobook-14",
        thumbnail_url: "https://picsum.photos/seed/asus/500/500",
        min_price: 19990000,
        max_price: 19990000,
        avg_rating: 4.6,
        review_count: 84,
      },
    },
    {
      id: "fsi-3",
      flash_price: 350000,
      original_price: 650000,
      sale_quantity_limit: 100,
      sold_count: 92,
      reserved_count: 5,
      product: {
        id: "p-fs3",
        name: "Áo Khoác Bomber Thể Thao Nam Năng Động",
        slug: "ao-khoac-bomber-nam",
        thumbnail_url: "https://picsum.photos/seed/bomber/500/500",
        min_price: 650000,
        max_price: 650000,
        avg_rating: 4.5,
        review_count: 210,
      },
    },
    {
      id: "fsi-4",
      flash_price: 890000,
      original_price: 1500000,
      sale_quantity_limit: 30,
      sold_count: 12,
      reserved_count: 2,
      product: {
        id: "p-fs4",
        name: "Tai Nghe Không Dây Noise Cancelling Pro",
        slug: "tai-nghe-wireless-pro",
        thumbnail_url: "https://picsum.photos/seed/headphone/500/500",
        min_price: 1500000,
        max_price: 1500000,
        avg_rating: 4.7,
        review_count: 67,
      },
    },
    {
      id: "fsi-4",
      flash_price: 890000,
      original_price: 1500000,
      sale_quantity_limit: 30,
      sold_count: 12,
      reserved_count: 2,
      product: {
        id: "p-fs4",
        name: "Tai Nghe Không Dây Noise Cancelling Pro",
        slug: "tai-nghe-wireless-pro",
        thumbnail_url: "https://picsum.photos/seed/headphone/500/500",
        min_price: 1500000,
        max_price: 1500000,
        avg_rating: 4.7,
        review_count: 67,
      },
    },
    {
      id: "fsi-4",
      flash_price: 890000,
      original_price: 1500000,
      sale_quantity_limit: 30,
      sold_count: 12,
      reserved_count: 2,
      product: {
        id: "p-fs4",
        name: "Tai Nghe Không Dây Noise Cancelling Pro",
        slug: "tai-nghe-wireless-pro",
        thumbnail_url: "https://picsum.photos/seed/headphone/500/500",
        min_price: 1500000,
        max_price: 1500000,
        avg_rating: 4.7,
        review_count: 67,
      },
    },
  ],
};

export const MOCK_NEW_PRODUCTS: Product[] = [
  {
    id: "np-1",
    name: "Bàn Phím Cơ Không Dây Cấu Trúc Gasket",
    slug: "ban-phim-co-gasket",
    thumbnail_url: "https://picsum.photos/seed/keyboard/400/400",
    min_price: 1250000,
    max_price: 1450000,
    avg_rating: 4.4,
    review_count: 32,
  },
  {
    id: "np-2",
    name: "Chuột Gaming Siêu Nhẹ 54g Wireless",
    slug: "chuot-gaming-superlight",
    thumbnail_url: "https://picsum.photos/seed/mouse/400/400",
    min_price: 990000,
    max_price: 990000,
    avg_rating: 4.7,
    review_count: 19,
  },
  {
    id: "np-3",
    name: "Đồng Hồ Thông Minh Màn Hình AMOLED v2",
    slug: "smartwatch-amoled-v2",
    thumbnail_url: "https://picsum.photos/seed/watch/400/400",
    min_price: 2300000,
    max_price: 2600000,
    avg_rating: 4.2,
    review_count: 11,
  },
  {
    id: "np-4",
    name: "Balo Chống Nước Tích Hợp Cổng Sạc USB",
    slug: "balo-chong-nuoc-usb",
    thumbnail_url: "https://picsum.photos/seed/backpack/400/400",
    min_price: 450000,
    max_price: 450000,
    avg_rating: 4.6,
    review_count: 54,
  },
  {
    id: "np-5",
    name: "Loa Bluetooth Kháng Nước IPX7 Bass Trầm",
    slug: "loa-bluetooth-ipx7",
    thumbnail_url: "https://picsum.photos/seed/speaker/400/400",
    min_price: 780000,
    max_price: 780000,
    avg_rating: 4.5,
    review_count: 41,
  },
  {
    id: "np-6",
    name: "Bình Giữ Nhiệt Lõi Inox 316 Cao Cấp 1L",
    slug: "binh-giu-nhiet-316",
    thumbnail_url: "https://picsum.photos/seed/bottle/400/400",
    min_price: 290000,
    max_price: 290000,
    avg_rating: 4.8,
    review_count: 112,
  },
  {
    id: "np-7",
    name: "Đèn LED Để Bàn Chống Cận Cảm Ứng Thông Minh",
    slug: "den-led-cam-ung",
    thumbnail_url: "https://picsum.photos/seed/lamp/400/400",
    min_price: 350000,
    max_price: 350000,
    avg_rating: 4.3,
    review_count: 23,
  },
  {
    id: "np-8",
    name: "Sạc Dự Phòng Sạc Nhanh PD 20W 20000mAh",
    slug: "powerbank-pd-20w",
    thumbnail_url: "https://picsum.photos/seed/powerbank/400/400",
    min_price: 520000,
    max_price: 520000,
    avg_rating: 4.6,
    review_count: 89,
  },
  {
    id: "np-8",
    name: "Sạc Dự Phòng Sạc Nhanh PD 20W 20000mAh",
    slug: "powerbank-pd-20w",
    thumbnail_url: "https://picsum.photos/seed/powerbank/400/400",
    min_price: 520000,
    max_price: 520000,
    avg_rating: 4.6,
    review_count: 89,
  },
  {
    id: "np-8",
    name: "Sạc Dự Phòng Sạc Nhanh PD 20W 20000mAh",
    slug: "powerbank-pd-20w",
    thumbnail_url: "https://picsum.photos/seed/powerbank/400/400",
    min_price: 520000,
    max_price: 520000,
    avg_rating: 4.6,
    review_count: 89,
  },
  {
    id: "np-8",
    name: "Sạc Dự Phòng Sạc Nhanh PD 20W 20000mAh",
    slug: "powerbank-pd-20w",
    thumbnail_url: "https://picsum.photos/seed/powerbank/400/400",
    min_price: 520000,
    max_price: 520000,
    avg_rating: 4.6,
    review_count: 89,
  },
];

export const MOCK_BEST_SELLERS: Product[] = [
  {
    id: "bs-1",
    name: "Kem Chống Nắng Kiềm Dầu Nâng Tông Tự Nhiên",
    slug: "kem-chong-nang-kiem-dau",
    thumbnail_url: "https://picsum.photos/seed/sunscreen/400/400",
    min_price: 320000,
    max_price: 320000,
    avg_rating: 4.8,
    review_count: 1420,
  },
  {
    id: "bs-2",
    name: "Nước Tẩy Trang Cấp Ẩm Dành Cho Da Nhạy Cảm",
    slug: "nuoc-tay-trang-micellar",
    thumbnail_url: "https://picsum.photos/seed/cleansing/400/400",
    min_price: 240000,
    max_price: 410000,
    avg_rating: 4.7,
    review_count: 985,
  },
  {
    id: "bs-3",
    name: "Bộ Nồi Chảo Chống Dính Vân Đá Cao Cấp",
    slug: "bo-noi-chao-van-da",
    thumbnail_url: "https://picsum.photos/seed/cookware/400/400",
    min_price: 1250000,
    max_price: 1250000,
    avg_rating: 4.6,
    review_count: 340,
  },
  {
    id: "bs-4",
    name: "Giày Thể Thao Sneaker Unisex Đệm Khí 🌟",
    slug: "giay-sneaker-dem-khi",
    thumbnail_url: "https://picsum.photos/seed/sneakers/400/400",
    min_price: 690000,
    max_price: 690000,
    avg_rating: 4.5,
    review_count: 512,
  },
  {
    id: "bs-5",
    name: "Nồi Chiên Không Dầu Điện Tử Thủy Tinh 6L",
    slug: "noi-chien-khong-dau-6l",
    thumbnail_url: "https://picsum.photos/seed/fryer/400/400",
    min_price: 1850000,
    max_price: 1850000,
    avg_rating: 4.7,
    review_count: 215,
  },
  {
    id: "bs-6",
    name: "Sách Tư Duy Ngược - Thay Đổi Tâm Thế",
    slug: "sach-tu-duy-nguoc",
    thumbnail_url: "https://picsum.photos/seed/book1/400/400",
    min_price: 880000,
    max_price: 880000,
    avg_rating: 4.9,
    review_count: 670,
  },
  {
    id: "bs-7",
    name: "Thảm Tập Yoga TPE Chống Trượt 8mm",
    slug: "tham-tap-yoga-tpe",
    thumbnail_url: "https://picsum.photos/seed/yogamat/400/400",
    min_price: 350000,
    max_price: 350000,
    avg_rating: 4.4,
    review_count: 180,
  },
  {
    id: "bs-8",
    name: "Xịt Khoáng Khóa Nền Cấp Nước Tức Thì",
    slug: "xit-khoang-cap-nuoc",
    thumbnail_url: "https://picsum.photos/seed/mist/400/400",
    min_price: 180000,
    max_price: 180000,
    avg_rating: 4.6,
    review_count: 295,
  },
  {
    id: "bs-8",
    name: "Xịt Khoáng Khóa Nền Cấp Nước Tức Thì",
    slug: "xit-khoang-cap-nuoc",
    thumbnail_url: "https://picsum.photos/seed/mist/400/400",
    min_price: 180000,
    max_price: 180000,
    avg_rating: 4.6,
    review_count: 295,
  },
  {
    id: "bs-8",
    name: "Xịt Khoáng Khóa Nền Cấp Nước Tức Thì",
    slug: "xit-khoang-cap-nuoc",
    thumbnail_url: "https://picsum.photos/seed/mist/400/400",
    min_price: 180000,
    max_price: 180000,
    avg_rating: 4.6,
    review_count: 295,
  },
  {
    id: "bs-8",
    name: "Xịt Khoáng Khóa Nền Cấp Nước Tức Thì",
    slug: "xit-khoang-cap-nuoc",
    thumbnail_url: "https://picsum.photos/seed/mist/400/400",
    min_price: 180000,
    max_price: 180000,
    avg_rating: 4.6,
    review_count: 295,
  },
  {
    id: "bs-8",
    name: "Xịt Khoáng Khóa Nền Cấp Nước Tức Thì",
    slug: "xit-khoang-cap-nuoc",
    thumbnail_url: "https://picsum.photos/seed/mist/400/400",
    min_price: 180000,
    max_price: 180000,
    avg_rating: 4.6,
    review_count: 295,
  },
  {
    id: "bs-8",
    name: "Xịt Khoáng Khóa Nền Cấp Nước Tức Thì",
    slug: "xit-khoang-cap-nuoc",
    thumbnail_url: "https://picsum.photos/seed/mist/400/400",
    min_price: 180000,
    max_price: 180000,
    avg_rating: 4.6,
    review_count: 295,
  },
  {
    id: "bs-8",
    name: "Xịt Khoáng Khóa Nền Cấp Nước Tức Thì",
    slug: "xit-khoang-cap-nuoc",
    thumbnail_url: "https://picsum.photos/seed/mist/400/400",
    min_price: 180000,
    max_price: 180000,
    avg_rating: 4.6,
    review_count: 295,
  },
];

export const MOCK_BRANDS: Brand[] = [
  {
    id: 1,
    name: "Apple",
    slug: "apple",
    logo_url: "https://picsum.photos/seed/apple_brand/150/80",
  },
  {
    id: 2,
    name: "Samsung",
    slug: "samsung",
    logo_url: "https://picsum.photos/seed/samsung_brand/150/80",
  },
  {
    id: 3,
    name: "Sony",
    slug: "sony",
    logo_url: "https://picsum.photos/seed/sony_brand/150/80",
  },
  {
    id: 4,
    name: "Asus",
    slug: "asus",
    logo_url: "https://picsum.photos/seed/asus_brand/150/80",
  },
  {
    id: 5,
    name: "Nike",
    slug: "nike",
    logo_url: "https://picsum.photos/seed/nike_brand/150/80",
  },
  {
    id: 6,
    name: "Adidas",
    slug: "adidas",
    logo_url: "https://picsum.photos/seed/adidas_brand/150/80",
  },
  {
    id: 7,
    name: "Logitech",
    slug: "logitech",
    logo_url: "https://picsum.photos/seed/logitech_brand/150/80",
  },
  {
    id: 8,
    name: "Anker",
    slug: "anker",
    logo_url: "https://picsum.photos/seed/anker_brand/150/80",
  },
  {
    id: 8,
    name: "Anker",
    slug: "anker",
    logo_url: "https://picsum.photos/seed/anker_brand/150/80",
  },
  {
    id: 8,
    name: "Anker",
    slug: "anker",
    logo_url: "https://picsum.photos/seed/anker_brand/150/80",
  },
  {
    id: 8,
    name: "Anker",
    slug: "anker",
    logo_url: "https://picsum.photos/seed/anker_brand/150/80",
  },
  {
    id: 8,
    name: "Anker",
    slug: "anker",
    logo_url: "https://picsum.photos/seed/anker_brand/150/80",
  },
  {
    id: 8,
    name: "Anker",
    slug: "anker",
    logo_url: "https://picsum.photos/seed/anker_brand/150/80",
  },
  {
    id: 8,
    name: "Anker",
    slug: "anker",
    logo_url: "https://picsum.photos/seed/anker_brand/150/80",
  },
  {
    id: 8,
    name: "Anker",
    slug: "anker",
    logo_url: "https://picsum.photos/seed/anker_brand/150/80",
  },
];

export const MOCK_HOME_VOUCHERS: HomeVoucher[] = [
  {
    id: "v-h1",
    code: "SZWELCOME",
    discount_type: "FIXED_AMOUNT",
    discount_value: 50000,
    min_order_value: 200000,
    desc: "Giảm ngay 50k cho đơn hàng đầu tiên",
  },
  {
    id: "v-h2",
    code: "TECHMAX",
    discount_type: "PERCENTAGE",
    discount_value: 10,
    min_order_value: 5000000,
    desc: "Giảm 10% các mặt hàng Công nghệ cao cấp",
  },
  {
    id: "v-h3",
    code: "FREESHIPX",
    discount_type: "FIXED_AMOUNT",
    discount_value: 30000,
    min_order_value: 150000,
    desc: "Mã miễn phí vận chuyển toàn quốc đơn từ 150k",
  },
  {
    id: "v-h3",
    code: "FREESHIPX",
    discount_type: "FIXED_AMOUNT",
    discount_value: 30000,
    min_order_value: 150000,
    desc: "Mã miễn phí vận chuyển toàn quốc đơn từ 150k",
  },
  {
    id: "v-h3",
    code: "FREESHIPX",
    discount_type: "FIXED_AMOUNT",
    discount_value: 30000,
    min_order_value: 150000,
    desc: "Mã miễn phí vận chuyển toàn quốc đơn từ 150k",
  },
];

export const MOCK_CATEGORY_TREE: CategoryNode[] = [
  {
    id: 100,
    name: "Thiết Bị Điện Tử",
    slug: "thiet-bi-dien-tu",
    thumbnail_url: "",
    parent_id: null,
    children: [
      {
        id: 101,
        name: "Điện thoại di động",
        slug: "dien-thoai",
        thumbnail_url: "",
        parent_id: 100,
      },
      {
        id: 102,
        name: "Laptop & Máy tính",
        slug: "laptop",
        thumbnail_url: "",
        parent_id: 100,
      },
      {
        id: 103,
        name: "Đồng hồ thông minh",
        slug: "dong-ho",
        thumbnail_url: "",
        parent_id: 100,
      },
      {
        id: 104,
        name: "Phụ kiện công nghệ",
        slug: "phu-kien-so",
        thumbnail_url: "",
        parent_id: 100,
      },
    ],
  },
  {
    id: 200,
    name: "Thời Trang & Xu Hướng",
    slug: "thoi-trang",
    thumbnail_url: "",
    parent_id: null,
    children: [
      {
        id: 201,
        name: "Thời trang Nam",
        slug: "thoi-trang-nam",
        thumbnail_url: "",
        parent_id: 200,
      },
      {
        id: 202,
        name: "Thời trang Nữ",
        slug: "thoi-trang-nu",
        thumbnail_url: "",
        parent_id: 200,
      },
      {
        id: 203,
        name: "Giày thể thao & Sneakers",
        slug: "giay-sneaker",
        thumbnail_url: "",
        parent_id: 200,
      },
      {
        id: 204,
        name: "Balo & Túi xách",
        slug: "balo-tui-xach",
        thumbnail_url: "",
        parent_id: 200,
      },
    ],
  },
  {
    id: 300,
    name: "Nhà Cửa & Đời Sống",
    slug: "nha-cua-doi-song",
    thumbnail_url: "",
    parent_id: null,
    children: [
      {
        id: 301,
        name: "Gia dụng thông minh",
        slug: "gia-dung",
        thumbnail_url: "",
        parent_id: 300,
      },
      {
        id: 302,
        name: "Dụng cụ nhà bếp",
        slug: "nha-bep",
        thumbnail_url: "",
        parent_id: 300,
      },
      {
        id: 303,
        name: "Đèn LED & Trang trí",
        slug: "den-trang-tri",
        thumbnail_url: "",
        parent_id: 300,
      },
    ],
  },
  {
    id: 400,
    name: "Sức Khỏe & Làm Đẹp",
    slug: "suc-khoe-lam-dep",
    thumbnail_url: "",
    parent_id: null,
    children: [
      {
        id: 401,
        name: "Mỹ phẩm chăm sóc da",
        slug: "my-pham",
        thumbnail_url: "",
        parent_id: 400,
      },
      {
        id: 402,
        name: "Dụng cụ thể thao",
        slug: "the-thao",
        thumbnail_url: "",
        parent_id: 400,
      },
    ],
  },
  {
    id: 500,
    name: "Giải Trí & Giáo Dục",
    slug: "giai-tri-giao-duc",
    thumbnail_url: "",
    parent_id: null,
    children: [
      {
        id: 501,
        name: "Sách tư duy & Kỹ năng",
        slug: "sach",
        thumbnail_url: "",
        parent_id: 500,
      },
      {
        id: 502,
        name: "Đồ chơi trí tuệ",
        slug: "do-choi",
        thumbnail_url: "",
        parent_id: 500,
      },
    ],
  },
];
