import { create } from "zustand";

interface HeaderState {
  isForceHidden: boolean;
  setForceHidden: (hidden: boolean) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  isForceHidden: false,
  setForceHidden: (hidden) => set({ isForceHidden: hidden }),
}));
