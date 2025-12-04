import { create } from "zustand";
import { getCartItems, CartAggregation, addItem, deleteItem } from "../types/api/cart";
import useProducts from "./productsStore";

type CartState = {
  cart: Record<string, {
    quantity: number
    cartIds: string[]
  }>;     
  fetchCart: (customerId: string) => Promise<void>;
  add: (productId: string, customerId: string) => Promise<void>;
  remove: (cartId: string, customerId: string, productId: string) => Promise<void>;
  clear: () => void;
};

export const useCart = create<CartState>((set, get) => ({
  cart: {},

  fetchCart: async (customerId) => {
    const res = await getCartItems(customerId);
    if (!res.success) {
      return;
    }
    const mapped: Record<string, {
      quantity: number
      cartIds: string[]
    }> = {};
    res.data.forEach((item: CartAggregation) => {
      mapped[item.product_id] = {
        quantity: item.total_quantity,
        cartIds: item.cart_ids
      };
    });
    set({ cart: mapped });
  },

  add: async (productId, customerId) => {
    await addItem({
      customer_id: customerId,
      product_id: productId,
      quantity: 1,
    });
    await get().fetchCart(customerId);
    await useProducts.getState().fetchProducts();
  },

  remove: async (cartId, customerId, productId) => {
    await deleteItem(cartId, productId);
    await Promise.all([get().fetchCart(customerId),
    useProducts.getState().fetchProducts()]);
  },

  clear: () => set({ cart: {} }),
}));
