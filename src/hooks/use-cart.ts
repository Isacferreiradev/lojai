"use client";

import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";

export function useCart() {
  const [hydrated, setHydrated] = useState(false);
  const cartStore = useCartStore();

  useEffect(() => {
    setHydrated(true);
  }, []);

  return {
    items: hydrated ? cartStore.items : [],
    couponCode: hydrated ? cartStore.couponCode : null,
    couponDiscountType: hydrated ? cartStore.couponDiscountType : null,
    couponDiscountValue: hydrated ? cartStore.couponDiscountValue : null,
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    applyCoupon: cartStore.applyCoupon,
    removeCoupon: cartStore.removeCoupon,
    clearCart: cartStore.clearCart,
    subtotal: hydrated ? cartStore.getCartSubtotal() : 0,
    discount: hydrated ? cartStore.getCartDiscount() : 0,
    total: hydrated ? cartStore.getCartTotal() : 0,
    count: hydrated ? cartStore.getCartCount() : 0,
    isHydrated: hydrated,
  };
}
