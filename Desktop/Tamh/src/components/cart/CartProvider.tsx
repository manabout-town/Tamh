"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { OrderItem } from "@/types/database";

// =========================================================
// Zustand store — 새로고침 대비 localStorage 영속화
// =========================================================
interface CartState {
  items: OrderItem[];
  tableNumber: number | null;
  setTableNumber: (n: number | null) => void;
  add: (item: OrderItem) => void;
  remove: (menuId: string) => void;
  updateQty: (menuId: string, qty: number) => void;
  clear: () => void;
  totalPrice: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: null,
      setTableNumber: (n) => set({ tableNumber: n }),
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.menu_id === item.menu_id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.menu_id === item.menu_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }
          return { items: [...s.items, item] };
        }),
      remove: (menuId) =>
        set((s) => ({ items: s.items.filter((i) => i.menu_id !== menuId) })),
      updateQty: (menuId, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.menu_id !== menuId)
              : s.items.map((i) =>
                  i.menu_id === menuId ? { ...i, quantity: qty } : i,
                ),
        })),
      clear: () => set({ items: [] }),
      totalPrice: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: "tamh-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// =========================================================
// Provider — Cart UI 상태 (드로어 열림 등)
// =========================================================
interface CartContextValue {
  items: OrderItem[];
  tableNumber: number | null;
  setTableNumber: (n: number | null) => void;
  add: (item: OrderItem) => void;
  remove: (menuId: string) => void;
  updateQty: (menuId: string, qty: number) => void;
  clear: () => void;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const store = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  const value: CartContextValue = {
    items: store.items,
    tableNumber: store.tableNumber,
    setTableNumber: store.setTableNumber,
    add: store.add,
    remove: store.remove,
    updateQty: store.updateQty,
    clear: store.clear,
    totalPrice: store.totalPrice(),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
