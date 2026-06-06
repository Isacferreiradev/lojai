import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscountType: "PERCENTAGE" | "FIXED" | null;
  couponDiscountValue: number | null;
  
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (code: string, type: "PERCENTAGE" | "FIXED", value: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;

  // Selectors/getters for derived values (since Zustand state doesn't auto-derive, we can calculate these on the fly or provide helper functions)
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscountType: null,
      couponDiscountValue: null,

      addItem: (newItem) => {
        const items = get().items;
        // Unique key based on product + selected color + size
        const id = `${newItem.productId}-${newItem.color || ""}-${newItem.size || ""}`;

        const existingItemIndex = items.findIndex((item) => item.id === id);

        if (existingItemIndex > -1) {
          const updatedItems = [...items];
          // Check stock limit
          const newQty = updatedItems[existingItemIndex].quantity + newItem.quantity;
          updatedItems[existingItemIndex].quantity = Math.min(newQty, newItem.stock);
          set({ items: updatedItems });
        } else {
          set({ items: [...items, { ...newItem, id }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === id);
        if (!item) return;

        // Constraint quantity to positive values and stock limit
        const safeQty = Math.max(1, Math.min(quantity, item.stock));
        
        set({
          items: items.map((i) => (i.id === id ? { ...i, quantity: safeQty } : i)),
        });
      },

      applyCoupon: (code, type, value) => {
        set({
          couponCode: code,
          couponDiscountType: type,
          couponDiscountValue: value,
        });
      },

      removeCoupon: () => {
        set({
          couponCode: null,
          couponDiscountType: null,
          couponDiscountValue: null,
        });
      },

      clearCart: () => {
        set({
          items: [],
          couponCode: null,
          couponDiscountType: null,
          couponDiscountValue: null,
        });
      },

      getCartSubtotal: () => {
        return get().items.reduce((acc, item) => {
          const price = item.promoPrice ?? item.price;
          return acc + price * item.quantity;
        }, 0);
      },

      getCartDiscount: () => {
        const subtotal = get().getCartSubtotal();
        const { couponDiscountType, couponDiscountValue } = get();

        if (!couponDiscountType || !couponDiscountValue) return 0;

        if (couponDiscountType === "PERCENTAGE") {
          return subtotal * (couponDiscountValue / 100);
        } else {
          return Math.min(couponDiscountValue, subtotal);
        }
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const discount = get().getCartDiscount();
        return Math.max(0, subtotal - discount);
      },

      getCartCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "lojai-cart-storage",
    }
  )
);
