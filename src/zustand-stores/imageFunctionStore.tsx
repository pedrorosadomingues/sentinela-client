import { create } from "zustand";
import { getAllImageFns } from "@/services";
import { ImageFunction } from "@/interfaces/imageFunction";

interface ImageFunctionStore {
  imageFunctions: [ImageFunction];
  setImageFunctions: (imageFunctions: [ImageFunction]) => void;
  getImageFunctions: () => Promise<void>;
}

export const useImageFunctionStore = create<ImageFunctionStore>((set) => ({
  imageFunctions: [{ id: 0, name: "", title: "" }],
  setImageFunctions: (imageFunctions: [ImageFunction]) =>
    set({ imageFunctions }),
  getImageFunctions: async () => {
    const response = await getAllImageFns();
    if (response.status === 200) {
      set({ imageFunctions: response.data });
    } else {
      console.error(response.message);
    }
  },
}));
