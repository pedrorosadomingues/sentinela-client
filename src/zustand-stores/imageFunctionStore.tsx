/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { getAllImageFns } from "@/services";

interface ImageFunctionStore {
  imageFunctions: any;
  setImageFunctions: (imageFunctions: string[]) => void;
  getImageFunctions: () => Promise<void>;
}

export const useImageFunctionStore = create<ImageFunctionStore>((set) => ({
  imageFunctions: null,
  setImageFunctions: (imageFunctions: string[]) => set({ imageFunctions }),
  getImageFunctions: async () => {
    const response = await getAllImageFns();
    if (response.status === 200) {
      set({ imageFunctions: response.data });
    } else {
      console.error(response.message);
    }
  },
}));
