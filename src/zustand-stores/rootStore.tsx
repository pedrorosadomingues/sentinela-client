import { create } from "zustand";

interface RootStore {
  rootControl: string;
  setRootControl: (control: string) => void;
}

export const useRootStore = create<RootStore>((set) => ({
  rootControl: "login",
  setRootControl: (control: string) => set({ rootControl: control }),
}));