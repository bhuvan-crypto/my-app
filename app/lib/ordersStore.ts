"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  add: (o: Order) => void;
  clear: () => void;
  remove: (id: string) => void;
  set: (items: Order[]) => void;
};

const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      add: (o) => set({ orders: [...get().orders, o] }),
      remove: (id) => set({ orders: get().orders.filter((x) => x.id !== id) }),
      clear: () => set({ orders: [] }),
      set: (items) => set({ orders: items }),
    }),
    {
      name: "app-orders",
    }
  )
);

export default useOrders;
