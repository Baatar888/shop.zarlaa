"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

type CartItem = {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalCount: () => number;
  totalPrice: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === product.id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                title: product.title,
                price: product.salePrice,
                imageUrl: product.images[0]?.url ?? "",
                quantity: 1,
              },
            ],
          };
        });
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQty: (productId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity: qty } : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      totalCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);
