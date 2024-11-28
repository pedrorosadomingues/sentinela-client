import { create } from "zustand";

interface HomeStore {
  homeControl: string;
  setHomeControl: (control: string) => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  homeControl: "home",
  setHomeControl: (control: string) => set({ homeControl: control }),
}));