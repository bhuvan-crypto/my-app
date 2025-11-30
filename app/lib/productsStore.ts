"use client";

import { persist } from "zustand/middleware";
import { Product, PRODUCTS } from "./products";
import { create } from "zustand";

type ProductsState = {
  products: Product[];
  add: (p: Omit<Product, "id">) => void;
  remove: (id: string) => void;
  update: (id: string, p: Partial<Product>) => void;
  set: (items: Product[]) => void;
};

const useProducts = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: PRODUCTS.slice(),
      add: (p) => {
        const id = `p${Date.now()}`;
        const item: Product = { id, ...p } as Product;
        set({ products: [...get().products, item] });
      },
      update: (id, p) => set({ products: get().products.map((x) => (x.id === id ? { ...x, ...p } : x)) }),
      remove: (id) => set({ products: get().products.filter((x) => x.id !== id) }),
      set: (items) => set({ products: items }),
    }),
    {
      name: "app-products",
    }
  )
);

export default useProducts;
