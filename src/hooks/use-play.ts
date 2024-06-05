import { create } from "zustand";

export interface PlayState {
  value: boolean;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
}

export const usePlay = create<PlayState>()((set) => ({
  value: false,
  setTrue: () => set({ value: true }),
  setFalse: () => set({ value: false }),
  toggle: () => set((prev) => ({ value: !prev.value })),
}));
