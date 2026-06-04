import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  skuId: string;
  productId: string;
  name: string;
  skuCode: string;
  price: number;
  image: string;
  quantity: number;
  stock: number; // Để chặn user tăng số lượng vượt quá số lượng kho vật lý sở hữu
  attributes: Record<string, unknown>;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (skuId: string) => void;
  updateQuantity: (skuId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // 1. Thêm sản phẩm vào giỏ (Nếu trùng mã SKU sẽ tự động cộng dồn số lượng)
      addItem: (newItem, quantity = 1) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.skuId === newItem.skuId,
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const potentialQty =
              updatedItems[existingIndex].quantity + quantity;

            // Chặn kiểm tra giới hạn tồn kho
            updatedItems[existingIndex].quantity =
              potentialQty > newItem.stock ? newItem.stock : potentialQty;
            return { items: updatedItems };
          }

          return { items: [...state.items, { ...newItem, quantity }] };
        }),

      // 2. Xóa món đồ khỏi giỏ hàng
      removeItem: (skuId) =>
        set((state) => ({
          items: state.items.filter((item) => item.skuId !== skuId),
        })),

      // 3. Cập nhật trực tiếp số lượng ô input
      updateQuantity: (skuId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.skuId === skuId
              ? {
                  ...item,
                  quantity: quantity > item.stock ? item.stock : quantity,
                }
              : item,
          ),
        })),

      // 4. Xóa sạch giỏ hàng (Gọi sau khi đặt hàng thành công)
      clearCart: () => set({ items: [] }),

      // 5. Hàm tính tổng tiền tiện ích
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.price) * item.quantity,
          0,
        );
      },

      // 6. Hàm đếm số lượng hiển thị badge trên Header icon giỏ hàng
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "shopzone-cart-storage", // Khóa định danh lưu dữ liệu dưới localStorage
    },
  ),
);
