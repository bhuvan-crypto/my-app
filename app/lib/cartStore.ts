import { create } from "zustand";
import { getCartItems, CartAggregation, addItem, deleteItem } from "../api/cart";
import useProducts from "./productsStore";

type CartState = {
  cart: Record<string, {
    quantity: number
    cartIds: string[]
  }>;     // productId → quantity
  loading: boolean;

  fetchCart: (customerId: string) => Promise<void>;
  add: (productId: string, customerId: string) => Promise<void>;
  remove: (cartId: string, customerId: string, productId: string) => Promise<void>;
  clear: () => void;
};

export const useCart = create<CartState>((set, get) => ({
  cart: {},
  loading: false,

  // 🔵 Load backend cart → convert to UI shape
  fetchCart: async (customerId) => {
    set({ loading: true });

    try {
      const res = await getCartItems(customerId);
      if (!res.success) {
        set({ loading: false });
        return;
      }
      // Convert to: { [productId]: quantity }
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

      set({ cart: mapped, loading: false });
    } catch (err) {
      console.error("Failed to fetch cart", err);
      set({ loading: false });
    }
  },

  // 🔵 Add 1 quantity
  add: async (productId, customerId) => {
    await addItem({
      customer_id: customerId,
      product_id: productId,
      quantity: 1,
    });
    await get().fetchCart(customerId);
    await useProducts.getState().fetchProducts();
  },

  // 🔵 Remove 1 quantity
  remove: async (cartId, customerId, productId) => {
    await deleteItem(cartId, productId);
    await Promise.all([get().fetchCart(customerId),
    useProducts.getState().fetchProducts()]);
  },

  clear: () => set({ cart: {} }),
}));
