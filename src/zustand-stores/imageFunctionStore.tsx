/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { getAllImageFns } from "@/services";

interface ImageFunctionStore {
  imageFunctions: any;
  setImageFunctions: (imageFunctions: string[]) => void;
  getImageFunctions: () => Promise<void>;

  imageFunctionName: string;
  setImageFunctionName: (imageFunctionName: string) => void;
}

export const useImageFunctionStore = create<ImageFunctionStore>((set, get) => ({
  imageFunctions: null,
  setImageFunctions: (imageFunctions: string[]) => set({ imageFunctions }),
  getImageFunctions: async () => {
    const response = await getAllImageFns();
    console.log("response", response);
    if (response.status === 200) {
      set({ imageFunctions: response.data });
      const updatedImageFunctions = get().imageFunctions; // Obtém o valor atualizado
      console.log("imageFunctionaas", updatedImageFunctions);
    } else {
      console.error(response.message);
    }
  },

  imageFunctionName: "",
  setImageFunctionName: (imageFunctionName: string) =>
    set({ imageFunctionName }),
}));
