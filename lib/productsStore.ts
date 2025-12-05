"use client";

import { persist } from "zustand/middleware";
import { Product, PRODUCTS } from "./products";
import { create } from "zustand";
import { addProduct, deleteProduct, getProducts, ICreateProduct, updateProduct } from "../api/products";

type ProductsState = {
  products: Product[];
  add: (p: ICreateProduct) => void;
  remove: (id: string) => void;
  set: (items: Product[]) => void;
  fetchProducts: () => Promise<void>;
};

const useProducts = create<ProductsState>()(
  (set, get) => ({
    products: [],
    add: async (data: ICreateProduct) => {
      await addProduct(data);
      await get().fetchProducts();
    },
    remove: async (id) => {
      await deleteProduct(id);
      await get().fetchProducts();
    },
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
