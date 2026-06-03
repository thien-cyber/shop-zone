-- ============================================================
--  SHOPZONE — FINAL DATABASE SCHEMA (PostgreSQL)
--  v3.0 — Tổng hợp đầy đủ + 3 fix từ Gemini review:
--    [Fix 1] Thứ tự bảng: user_voucher_usages dời sau order_items
--    [Fix 2] flash_sale_items: thêm reserved_count + cập nhật CHECK
--    [Fix 3] Soft Delete: categories, brands, vouchers + FK RESTRICT
-- ============================================================


-- ============================================================
--  PHẦN 0: CẤU HÌNH BAN ĐẦU & ENUMS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role            AS ENUM ('CUSTOMER', 'STAFF', 'ADMIN');
CREATE TYPE auth_provider        AS ENUM ('LOCAL', 'GOOGLE');
CREATE TYPE order_status         AS ENUM ('PENDING_PAYMENT', 'PENDING_CONFIRMATION', 'SHIPPING', 'DELIVERED', 'CANCELLED');
CREATE TYPE payment_status       AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE payment_method       AS ENUM ('COD', 'VNPAY', 'STRIPE');
CREATE TYPE discount_type        AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');
CREATE TYPE flash_sale_status    AS ENUM ('SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED');
CREATE TYPE refund_status        AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE refund_reason        AS ENUM ('CUSTOMER_REQUEST', 'WRONG_ITEM', 'DAMAGED', 'OUT_OF_STOCK', 'OTHER');
CREATE TYPE attribute_input_type AS ENUM ('TEXT', 'NUMBER', 'SELECT', 'MULTI_SELECT', 'BOOLEAN');


-- ============================================================
--  PHẦN 1: PHÂN HỆ TÀI KHOẢN & PHÂN QUYỀN (AUTH & USER)
-- ============================================================

-- ------------------------------------------------------------
-- 1. users
-- ------------------------------------------------------------
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NULL,       -- NULL nếu đăng nhập bằng Google
    full_name     VARCHAR(100) NOT NULL,
    avatar_url    VARCHAR(500) NULL,
    role          user_role     DEFAULT 'CUSTOMER' NOT NULL,
    provider      auth_provider DEFAULT 'LOCAL'    NOT NULL,
    provider_id   VARCHAR(255) NULL,       -- ID từ Google OAuth2
    is_active     BOOLEAN DEFAULT TRUE NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON users(email);


-- ------------------------------------------------------------
-- 2. addresses — Sổ địa chỉ khách hàng
-- ------------------------------------------------------------
CREATE TABLE addresses (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    phone_number   VARCHAR(20)  NOT NULL,
    province       VARCHAR(100) NOT NULL,  -- Tỉnh/Thành phố
    district       VARCHAR(100) NOT NULL,  -- Quận/Huyện
    ward           VARCHAR(100) NOT NULL,  -- Phường/Xã
    street_address VARCHAR(255) NOT NULL,  -- Số nhà, tên đường
    is_default     BOOLEAN DEFAULT FALSE NOT NULL,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);


-- ------------------------------------------------------------
-- 3. refresh_tokens — Thu hồi token khi ban user / đổi mật khẩu
--    HttpOnly Cookie đơn thuần không có cơ chế revoke.
-- ------------------------------------------------------------
CREATE TABLE refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL, -- Lưu hash, không lưu raw token
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE NOT NULL,
    ip_address VARCHAR(45)  NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_refresh_tokens_user_id    ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);


-- ============================================================
--  PHẦN 2: PHÂN HỆ SẢN PHẨM & KHO HÀNG (CATALOG & INVENTORY)
-- ============================================================

-- ------------------------------------------------------------
-- 4. categories — Danh mục đa cấp (Adjacency List)
--    [Fix 3] Thêm deleted_at để Soft Delete thay vì xóa vật lý,
--            tránh làm hỏng FK của bảng products khi xóa danh mục.
-- ------------------------------------------------------------
CREATE TABLE categories (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    slug          VARCHAR(150) UNIQUE NOT NULL,
    parent_id     INT NULL REFERENCES categories(id) ON DELETE SET NULL,
    thumbnail_url VARCHAR(500) NULL,        -- Ảnh hiển thị trang chủ "Danh mục nổi bật"
    sort_order    INT DEFAULT 0 NOT NULL,   -- Thứ tự hiển thị trang chủ
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at    TIMESTAMP WITH TIME ZONE NULL  -- NULL = đang hoạt động | có giá trị = đã xóa mềm
);


-- ------------------------------------------------------------
-- 5. brands — Thương hiệu
--    [Fix 3] Thêm deleted_at để Soft Delete.
-- ------------------------------------------------------------
CREATE TABLE brands (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    slug       VARCHAR(150) UNIQUE NOT NULL,
    logo_url   VARCHAR(500) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL  -- NULL = đang hoạt động | có giá trị = đã xóa mềm
);


-- ------------------------------------------------------------
-- 6. products — Thông tin sản phẩm cốt lõi
--    FK giữ ON DELETE RESTRICT (đúng theo cả 2 review).
-- ------------------------------------------------------------
CREATE TABLE products (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name             VARCHAR(255) NOT NULL,
    slug             VARCHAR(255) UNIQUE NOT NULL,
    description      TEXT NULL,
    thumbnail_url    VARCHAR(500) NULL,      -- Ảnh đại diện cho trang danh sách / search
    meta_title       VARCHAR(255) NULL,      -- SEO: fallback về name nếu NULL
    meta_description TEXT NULL,             -- SEO: fallback về description nếu NULL
    avg_rating       NUMERIC(3, 2) DEFAULT 0.00 NOT NULL, -- Denormalized, cập nhật sau mỗi review
    review_count     INT           DEFAULT 0 NOT NULL,    -- Denormalized, tránh COUNT(*) JOIN nặng
    category_id      INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    brand_id         INT NOT NULL REFERENCES brands(id)    ON DELETE RESTRICT,
    is_active        BOOLEAN DEFAULT TRUE NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- GIN Index cho PostgreSQL Full-Text Search
CREATE INDEX idx_products_search_gin ON products
    USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));


-- ------------------------------------------------------------
-- 7. attribute_definitions — Bộ thuộc tính hợp lệ theo danh mục
--    Giúp Admin UI render đúng form nhập liệu từng ngành hàng.
-- ------------------------------------------------------------
CREATE TABLE attribute_definitions (
    id          SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    key         VARCHAR(100) NOT NULL,         -- Key trong JSONB (VD: 'ram', 'color')
    label       VARCHAR(100) NOT NULL,         -- Nhãn hiển thị (VD: 'Dung lượng RAM')
    input_type  attribute_input_type DEFAULT 'TEXT' NOT NULL,
    options     JSONB NULL,                    -- Chọn nếu là SELECT (VD: ["8GB","16GB","32GB"])
    is_required BOOLEAN DEFAULT FALSE NOT NULL,
    sort_order  INT DEFAULT 0 NOT NULL,

    UNIQUE (category_id, key)
);

CREATE INDEX idx_attr_def_category_id ON attribute_definitions(category_id);


-- ------------------------------------------------------------
-- 8. product_skus — Biến thể sản phẩm & Quản lý giữ kho
-- ------------------------------------------------------------
CREATE TABLE product_skus (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id        UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku_code          VARCHAR(100) UNIQUE NOT NULL, -- Mã kho độc nhất (VD: IP15PM-BLK-256)
    price             NUMERIC(12, 2) NOT NULL,      -- Giá bán lẻ công khai
    cost_price        NUMERIC(12, 2) NOT NULL,      -- Giá vốn (tính biên lợi nhuận)
    stock             INT DEFAULT 0 NOT NULL,        -- Số lượng thực tế trong kho vật lý
    reserved_quantity INT DEFAULT 0 NOT NULL,        -- Đang tạm giữ chờ thanh toán Online
    images            JSONB NOT NULL,               -- Mảng link ảnh của SKU
    attributes        JSONB NOT NULL,               -- EAV động (VD: {"color":"Black","ram":"8GB"})
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT chk_stock    CHECK (stock >= 0),
    CONSTRAINT chk_reserved CHECK (reserved_quantity >= 0)
);

CREATE INDEX idx_product_skus_attributes ON product_skus USING gin(attributes);
CREATE INDEX idx_product_skus_product_id ON product_skus(product_id);


-- ============================================================
--  PHẦN 3: PHÂN HỆ KHUYẾN MÃI (MARKETING)
-- ============================================================

-- ------------------------------------------------------------
-- 9. vouchers — Mã giảm giá
--    [Fix 3] Thêm deleted_at để Soft Delete.
-- ------------------------------------------------------------
CREATE TABLE vouchers (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code               VARCHAR(50) UNIQUE NOT NULL,
    discount_type      discount_type NOT NULL,
    discount_value     NUMERIC(12, 2) NOT NULL,
    min_order_value    NUMERIC(12, 2) DEFAULT 0.00 NOT NULL, -- Đơn tối thiểu để áp dụng
    max_discount_value NUMERIC(12, 2) NULL,                  -- Trần giảm giá nếu là %
    usage_limit        INT NOT NULL,                         -- Tổng lượt phát hành tối đa
    used_count         INT DEFAULT 0 NOT NULL,               -- Số lượt đã kích hoạt
    start_date         TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date           TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at         TIMESTAMP WITH TIME ZONE NULL,        -- NULL = đang hoạt động | có giá trị = đã xóa mềm

    CONSTRAINT chk_voucher_usage CHECK (used_count <= usage_limit)
);


-- ------------------------------------------------------------
-- 10. flash_sales — Campaign Flash Sale (khung giờ, trạng thái)
-- ------------------------------------------------------------
CREATE TABLE flash_sales (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       VARCHAR(255) NOT NULL,             -- VD: "Flash Sale 12h Thứ 6"
    status     flash_sale_status DEFAULT 'SCHEDULED' NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time   TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT chk_flash_sale_time CHECK (end_time > start_time)
);

CREATE INDEX idx_flash_sales_status_time ON flash_sales(status, start_time, end_time);


-- ------------------------------------------------------------
-- 11. flash_sale_items — SKU + giá + giới hạn số lượng trong campaign
--    [Fix 2] Thêm reserved_count để chặn Over-reservation:
--            hàng ngàn user cùng bấm "Mua" trong 1 giây Flash Sale.
--            CHECK: sold_count + reserved_count <= sale_quantity_limit
-- ------------------------------------------------------------
CREATE TABLE flash_sale_items (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flash_sale_id       UUID NOT NULL REFERENCES flash_sales(id)    ON DELETE CASCADE,
    sku_id              UUID NOT NULL REFERENCES product_skus(id)   ON DELETE CASCADE,
    flash_price         NUMERIC(12, 2) NOT NULL,  -- Giá bán riêng trong Flash Sale
    sale_quantity_limit INT NOT NULL,             -- Số lượng tối đa bán trong campaign
    sold_count          INT DEFAULT 0 NOT NULL,   -- Số đã bán thật (xác nhận thanh toán thành công)
    reserved_count      INT DEFAULT 0 NOT NULL,   -- Đang giữ chỗ chờ thanh toán (chưa chắc chắn)
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Tổng đã bán + đang giữ không được vượt giới hạn campaign
    CONSTRAINT chk_flash_sold CHECK (sold_count + reserved_count <= sale_quantity_limit),
    UNIQUE (flash_sale_id, sku_id)  -- 1 SKU chỉ xuất hiện 1 lần trong 1 campaign
);

CREATE INDEX idx_flash_sale_items_flash_sale_id ON flash_sale_items(flash_sale_id);
CREATE INDEX idx_flash_sale_items_sku_id        ON flash_sale_items(sku_id);


-- ============================================================
--  PHẦN 4: PHÂN HỆ ĐẶT HÀNG & THANH TOÁN (ORDERS & PAYMENTS)
-- ============================================================

-- ------------------------------------------------------------
-- 12. orders — Quản lý đơn hàng
--    [Fix 3] voucher_id: ON DELETE RESTRICT thay vì SET NULL
--            → ngăn Admin xóa voucher khi còn đơn hàng liên kết.
-- ------------------------------------------------------------
CREATE TABLE orders (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number     VARCHAR(50) UNIQUE NOT NULL, -- Mã hiển thị (VD: SZ-20260602-XXXX)
    user_id          UUID NOT NULL REFERENCES users(id)    ON DELETE RESTRICT,
    status           order_status   DEFAULT 'PENDING_PAYMENT' NOT NULL,
    payment_status   payment_status DEFAULT 'PENDING'        NOT NULL,
    payment_method   payment_method NOT NULL,

    -- Snapshot địa chỉ lúc mua: hóa đơn lịch sử không bị sai lệch
    -- khi khách thay đổi sổ địa chỉ sau này
    shipping_address JSONB NOT NULL,
    shipping_fee     NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,

    total_items_price NUMERIC(12, 2) NOT NULL,               -- Tổng tiền gốc hàng hóa
    discount_price    NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,  -- Tiền giảm từ voucher
    final_price       NUMERIC(12, 2) NOT NULL,               -- Số tiền khách phải trả cuối cùng

    -- [Fix 3] RESTRICT thay vì SET NULL để bảo vệ dữ liệu lịch sử đơn hàng
    voucher_id       UUID NULL REFERENCES vouchers(id) ON DELETE RESTRICT,
    notes            TEXT NULL,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_orders_user_id           ON orders(user_id);
CREATE INDEX idx_orders_status            ON orders(status);
-- Composite index cho Cron Job hủy đơn quá hạn:
-- WHERE status = 'PENDING_PAYMENT' AND created_at < NOW() - INTERVAL '30 min'
CREATE INDEX idx_orders_status_created_at ON orders(status, created_at);


-- ------------------------------------------------------------
-- 13. order_items — Chi tiết mặt hàng trong đơn
-- ------------------------------------------------------------
CREATE TABLE order_items (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id   UUID NOT NULL REFERENCES orders(id)       ON DELETE CASCADE,
    sku_id     UUID NOT NULL REFERENCES product_skus(id) ON DELETE RESTRICT,
    quantity   INT NOT NULL,
    price      NUMERIC(12, 2) NOT NULL, -- Snapshot giá lúc thanh toán
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
-- Index cho Guard kiểm tra "đã mua" trước khi viết review
CREATE INDEX idx_order_items_sku_id   ON order_items(sku_id);


-- ------------------------------------------------------------
-- 14. user_voucher_usages — Chặn 1 user dùng lại cùng 1 mã
--    [Fix 1] Dời xuống SAU order_items vì có FK tới bảng orders.
--            Nếu để trước orders, PostgreSQL báo lỗi khi chạy script.
-- ------------------------------------------------------------
CREATE TABLE user_voucher_usages (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    voucher_id UUID NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
    order_id   UUID NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
    used_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    UNIQUE (user_id, voucher_id)  -- Mỗi user chỉ được dùng 1 mã 1 lần
);

CREATE INDEX idx_user_voucher_usages_user_id    ON user_voucher_usages(user_id);
CREATE INDEX idx_user_voucher_usages_voucher_id ON user_voucher_usages(voucher_id);


-- ------------------------------------------------------------
-- 15. payments — Lịch sử thanh toán & lưu raw Webhook đối tác
-- ------------------------------------------------------------
CREATE TABLE payments (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id             UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    transaction_id       VARCHAR(255) NULL,   -- Mã giao dịch từ Stripe/VNPAY
    amount               NUMERIC(12, 2) NOT NULL,
    payment_method       payment_method NOT NULL,
    status               payment_status DEFAULT 'PENDING' NOT NULL,
    raw_webhook_response JSONB NULL,          -- Raw payload từ Webhook/IPN để đối soát lỗi
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at           TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_payments_order_id ON payments(order_id);


-- ------------------------------------------------------------
-- 16. shipments — Mã vận đơn & đơn vị vận chuyển
--    Nhân viên cập nhật khi chuyển trạng thái sang "SHIPPING".
-- ------------------------------------------------------------
CREATE TABLE shipments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    carrier_name    VARCHAR(100) NOT NULL,          -- VD: 'GHN', 'GHTK', 'ViettelPost'
    tracking_number VARCHAR(100) NOT NULL,          -- Mã vận đơn của đơn vị vận chuyển
    tracking_url    VARCHAR(500) NULL,              -- Link tra cứu trực tiếp (nếu có)
    shipped_at      TIMESTAMP WITH TIME ZONE NULL,  -- Thời điểm bàn giao shipper
    delivered_at    TIMESTAMP WITH TIME ZONE NULL,  -- Thời điểm giao thành công
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- ------------------------------------------------------------
-- 17. refunds — Quản lý luồng hoàn tiền
--    Cần bảng riêng để đối soát kế toán & Stripe Refund API.
-- ------------------------------------------------------------
CREATE TABLE refunds (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id          UUID NOT NULL REFERENCES orders(id)    ON DELETE RESTRICT,
    payment_id        UUID NOT NULL REFERENCES payments(id)  ON DELETE RESTRICT,
    amount            NUMERIC(12, 2) NOT NULL,
    reason            refund_reason NOT NULL,
    note              TEXT NULL,                   -- Ghi chú từ admin/staff
    status            refund_status DEFAULT 'PENDING' NOT NULL,
    gateway_refund_id VARCHAR(255) NULL,           -- ID hoàn tiền từ Stripe/VNPAY
    processed_by      UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_refunds_order_id   ON refunds(order_id);
CREATE INDEX idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX idx_refunds_status     ON refunds(status);


-- ============================================================
--  PHẦN 5: PHÂN HỆ TƯƠNG TÁC & NHẬT KÝ (ENGAGEMENT & AUDIT)
-- ============================================================

-- ------------------------------------------------------------
-- 18. wishlists — Sản phẩm yêu thích (Many-to-Many)
-- ------------------------------------------------------------
CREATE TABLE wishlists (
    user_id    UUID NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    PRIMARY KEY (user_id, product_id)  -- Cụm PK ngăn trùng lặp
);


-- ------------------------------------------------------------
-- 19. reviews — Đánh giá sản phẩm (chỉ sau khi nhận hàng)
-- ------------------------------------------------------------
CREATE TABLE reviews (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id)          ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id)       ON DELETE CASCADE,
    sku_id     UUID NOT NULL REFERENCES product_skus(id)   ON DELETE CASCADE,
    rating     INT NOT NULL CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
    comment    TEXT NULL,
    images     JSONB NULL,                     -- Hình ảnh thực tế từ khách hàng
    is_visible BOOLEAN DEFAULT TRUE NOT NULL,  -- Admin ẩn review spam/thô tục
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Mỗi user chỉ được review 1 lần cho mỗi SKU
    CONSTRAINT uq_reviews_user_sku UNIQUE (user_id, sku_id)
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);


-- ------------------------------------------------------------
-- 20. notifications — Thông báo realtime (WebSocket / SSE)
-- ------------------------------------------------------------
CREATE TABLE notifications (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    content    TEXT NOT NULL,
    type       VARCHAR(50) DEFAULT 'SYSTEM' NOT NULL,  -- ORDER_STATUS | PROMOTION | SYSTEM
    is_read    BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_notifications_user_id_read ON notifications(user_id, is_read);


-- ------------------------------------------------------------
-- 21. audit_logs — Nhật ký hành động Admin/Staff
-- ------------------------------------------------------------
CREATE TABLE audit_logs (
    id         BIGSERIAL PRIMARY KEY,  -- BIGSERIAL: log sẽ rất lớn theo thời gian
    user_id    UUID NULL REFERENCES users(id) ON DELETE SET NULL, -- NULL = hệ thống tự chạy
    action     VARCHAR(100) NOT NULL,  -- VD: 'UPDATE_PRODUCT_PRICE', 'BAN_USER'
    method     VARCHAR(10)  NOT NULL,  -- PUT, PATCH, DELETE
    url        VARCHAR(255) NOT NULL,  -- VD: /api/v1/admin/products/xxx
    old_values JSONB NULL,             -- Dữ liệu trước khi thay đổi
    new_values JSONB NULL,             -- Dữ liệu sau khi thay đổi
    ip_address VARCHAR(45)  NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_logs_action ON audit_logs(action);


-- ============================================================
--  TỔNG KẾT SCHEMA — SHOPZONE FINAL v3.0
-- ============================================================
--
--  ENUMS (10):
--    user_role, auth_provider, order_status, payment_status,
--    payment_method, discount_type, flash_sale_status,
--    refund_status, refund_reason, attribute_input_type
--
--  BẢNG (21) — thứ tự đã đảm bảo dependency FK:
--    [Phần 1] Auth/User (3):
--      1. users
--      2. addresses
--      3. refresh_tokens
--    [Phần 2] Catalog/Inventory (5):
--      4. categories         ← deleted_at (Soft Delete)
--      5. brands             ← deleted_at (Soft Delete)
--      6. products
--      7. attribute_definitions
--      8. product_skus
--    [Phần 3] Marketing (3):
--      9.  vouchers          ← deleted_at (Soft Delete)
--      10. flash_sales
--      11. flash_sale_items  ← reserved_count (chống Over-reservation)
--    [Phần 4] Orders/Payments (6):
--      12. orders            ← voucher_id ON DELETE RESTRICT
--      13. order_items
--      14. user_voucher_usages  ← dời xuống đây (Fix 1)
--      15. payments
--      16. shipments
--      17. refunds
--    [Phần 5] Engagement/Audit (4):
--      18. wishlists
--      19. reviews           ← UNIQUE (user_id, sku_id)
--      20. notifications
--      21. audit_logs
--
--  ĐIỂM KIẾN TRÚC NỔI BẬT:
--    • Inventory Reservation: stock + reserved_quantity + Redlock
--      → chặn Race Condition đặt hàng thường
--    • Flash Sale Over-reservation: flash_sale_items.reserved_count
--      → CHECK (sold_count + reserved_count <= sale_quantity_limit)
--      → chặn Race Condition Flash Sale hàng ngàn user/giây
--    • JSONB + GIN Index: attributes lọc động mọi ngành hàng (EAV)
--    • Snapshot: shipping_address (orders) + price (order_items)
--      → hóa đơn lịch sử không bị sai lệch khi đổi giá/địa chỉ
--    • Soft Delete: categories, brands, vouchers có deleted_at
--      → không bao giờ phá vỡ FK của đơn hàng lịch sử
--    • ON DELETE RESTRICT trên voucher_id
--      → Admin không thể xóa voucher khi còn đơn hàng liên kết
--    • user_voucher_usages → chặn 1 user dùng lại mã voucher
--    • refresh_tokens → revoke session khi ban user / đổi mật khẩu
--    • attribute_definitions → Admin UI render form đúng ngành hàng
--    • Audit Log: old_values + new_values → tra cứu gian lận nội bộ
--
-- ============================================================