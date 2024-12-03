import { create } from "zustand";

interface MainStore {
  mainControl: string;
  setMainControl: (control: string) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useMainStore = create<MainStore>((set) => ({
  mainControl: "Home",
  setMainControl: (control: string) => set({ mainControl: control }),

  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
}));
