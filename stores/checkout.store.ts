import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CheckoutItem {
  caseOptionId: string;
  quantity: number;
}

interface CheckoutState {
  checkoutItems: CheckoutItem[];
}

interface CheckoutAction {
  // eslint-disable-next-line no-unused-vars
  setCheckoutItem: (item: CheckoutItem) => void;
  // eslint-disable-next-line no-unused-vars
  setCheckoutItems: (items: CheckoutItem[]) => void;
  // eslint-disable-next-line no-unused-vars
  replaceCheckoutItems: (items: CheckoutItem[]) => void;
  clearCheckoutItems: () => void;
}

export const useCheckoutStore = create<CheckoutState & CheckoutAction>()(
  persist(
    (set) => ({
      checkoutItems: [],
      setCheckoutItem: (item) =>
        set((state) => ({
          checkoutItems: [...state.checkoutItems, item],
        })),
      setCheckoutItems: (items) =>
        set((state) => ({
          checkoutItems: [...state.checkoutItems, ...items],
        })),
      clearCheckoutItems: () => set({ checkoutItems: [] }),
      replaceCheckoutItems: (items) => set({ checkoutItems: items }),
    }),
    {
      name: "cart-items",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
