"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export interface CartItem {
  cartLineId: string;
  productId: string;
  name: string;
  image?: string | null;
  unitPrice: number;
  quantity: number;
  optionId?: string;
  optionName?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cartLineId">) => void;
  removeItem: (cartLineId: string) => void;
  updateQuantity: (cartLineId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "rxsaas_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "cartLineId">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.optionId === item.optionId
      );
      if (existing) {
        return prev.map((i) =>
          i.cartLineId === existing.cartLineId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, { ...item, cartLineId: `${item.productId}-${item.optionId ?? "default"}-${Date.now()}` }];
    });
  }, []);

  const removeItem = useCallback((cartLineId: string) => {
    setItems((prev) => prev.filter((i) => i.cartLineId !== cartLineId));
  }, []);

  const updateQuantity = useCallback((cartLineId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.cartLineId !== cartLineId));
      return;
    }
    setItems((prev) => prev.map((i) => (i.cartLineId === cartLineId ? { ...i, quantity } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
