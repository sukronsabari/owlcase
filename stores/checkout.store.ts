import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useSyncExternalStore } from "react";

export interface CheckoutItem {
  caseOptionId: string;
  quantity: number;
}

interface CheckoutState {
  checkoutItems: CheckoutItem[];
}

interface CheckoutAction {
  setCheckoutItem: (item: CheckoutItem) => void;
  setCheckoutItems: (items: CheckoutItem[]) => void;
  replaceCheckoutItems: (items: CheckoutItem[]) => void;
  clearCheckoutItems: () => void;
}

export const useCheckoutStore = create<CheckoutState & CheckoutAction>()(
  persist(
    (set, get) => ({
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
