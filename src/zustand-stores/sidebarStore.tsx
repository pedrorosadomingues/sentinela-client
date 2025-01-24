import { create } from "zustand";

interface ISidebarStore {
  isExpanded: boolean;
  isLocked: boolean;
  openCoinModal: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  setIsLocked: (isLocked: boolean) => void;
  setOpenCoinModal: (openCoinModal: boolean) => void;
}

export const useSidebarStore = create<ISidebarStore>((set) => ({
  isExpanded: false,
  isLocked: false,
  openCoinModal: false,
  setIsExpanded: (isExpanded) => set({ isExpanded }),
  setIsLocked: (isLocked) => set({ isLocked }),
  setOpenCoinModal: (openCoinModal) => set({ openCoinModal }),
}));

export default useSidebarStore;
