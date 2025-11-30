import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartState = {
  cart: Record<string, number>;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cart: {},
      add: (id: string) =>
        set((s) => ({ cart: { ...s.cart, [id]: (s.cart[id] ?? 0) + 1 } })),
      remove: (id: string) =>
        set((s) => {
          const qty = s.cart[id] ?? 0;
          if (qty <= 1) {
            const { [id]: _, ...rest } = s.cart;
            return { cart: rest };
          }
          return { cart: { ...s.cart, [id]: qty - 1 } };
        }),
      clear: () => set({ cart: {} }),
    }),
    {
      name: 'app-cart',
    }
  )
);

export default useCart;
