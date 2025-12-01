"use client";

import { persist } from "zustand/middleware";
import { Product, PRODUCTS } from "./products";
import { create } from "zustand";
import { getProducts } from "../api/products";

type ProductsState = {
  products: Product[];
  add: (p: Omit<Product, "id">) => void;
  remove: (id: string) => void;
  update: (id: string, p: Partial<Product>) => void;
  set: (items: Product[]) => void;
  fetchProducts: () => Promise<void>;
};

const useProducts = create<ProductsState>()(
  (set, get) => ({
    products: [],
    add: (p) => {
      const id = `p${Date.now()}`;
      const item: Product = { id, ...p } as Product;
      set({ products: [...get().products, item] });
    },
    update: (id, p) => set({ products: get().products.map((x) => (x.id === id ? { ...x, ...p } : x)) }),
    remove: (id) => set({ products: get().products.filter((x) => x.id !== id) }),
    set: (items) => set({ products: items }),
    fetchProducts: async () => {
      const res = await getProducts();
      if (res.success) {
        set({
          products: res.data.data.map((p) => ({
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            stockQuantity: p.stock_quantity,
            categoryId: p.category_id,
            createdBy: p.created_by,
            updatedBy: p.updated_by,
            isDeleted: p.is_deleted,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
          }))
        });
      } 
    },
  })
);

export default useProducts;
