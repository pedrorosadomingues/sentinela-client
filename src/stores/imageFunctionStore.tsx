import { create } from "zustand";
import { getAllImageFns } from "@/services";
import { ImageFunctionProps } from "@/interfaces/image-function";

interface ImageFunctionStore {
  isFetching: boolean;
  imageFunctions: ImageFunctionProps[];
  setImageFunctions: (imageFunctions: ImageFunctionProps[]) => void;
  getImageFunctions: (locale: string) => Promise<void>;
}

export const useImageFunctionStore = create<ImageFunctionStore>((set) => ({
  isFetching: false,
  imageFunctions: [],
  setImageFunctions: (imageFunctions: ImageFunctionProps[]) =>
    set({ imageFunctions }),
  getImageFunctions: async (locale) => {
    set({ isFetching: true });

    const response = await getAllImageFns(locale);

    if (response.status === 200) {
      set({ imageFunctions: response.data, isFetching: false });
    } else {
      console.error(response.message);
    }
  },
}));
