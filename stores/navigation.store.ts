import { create } from "zustand";

interface NavigationState {
  isOpen: boolean;
}

interface NavigationAction {
  toggleIsOpen: () => void;
}

export const useNavigationStore = create<NavigationState & NavigationAction>()(
  (set) => ({
    isOpen: false,
    toggleIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  })
);
