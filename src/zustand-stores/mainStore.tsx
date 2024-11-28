import { create } from "zustand";

interface MainStore {
  mainControl: string;
  setMainControl: (control: string) => void;
}

export const useMainStore = create<MainStore>((set) => ({
  mainControl: "Home",
  setMainControl: (control: string) => set({ mainControl: control }),
}));
