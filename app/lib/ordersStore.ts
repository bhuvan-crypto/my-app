"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addItem, deleteItem, getItems } from "../api/order";
import { useCart } from "./cartStore";
import { useAuthStore } from "./authStore";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: number;
};

type OrdersState = {
  orders: Order[];
  add: () => void;
  clear: () => void;
  remove: (id: string) => void;
  set: (items: Order[]) => void;
  fetchOrders: () => Promise<void>;
};

const useOrders = create<OrdersState>()(
  (set, get) => ({
    orders: [],
    add: async () => {
      await addItem();
      await get().fetchOrders();
      await useCart.getState().fetchCart(useAuthStore.getState().user.id);
    },
    clear: () => set({ orders: [] }),
    set: (items) => set({ orders: items }),
    fetchOrders: async () => {
      const res = await getItems();
      if (!res.success) {
        return;
      }
      const mapped: Order[] = [];
      res.data.forEach((item) => {
        mapped.push({
          id: item._id,
          items: [{
            id: item.product_id,
            name: "Product " + item.product_id,
            price: item.sum,
            qty: item.quantity,
          }],
          total: item.sum,
          createdAt: new Date(item.createdAt).getTime(),
        });
      });
      set({ orders: mapped });
    },
    remove: async (orderId) => {
      await deleteItem(orderId);
      await Promise.all([get().fetchOrders()]);
    }
  })
);

export default useOrders;
