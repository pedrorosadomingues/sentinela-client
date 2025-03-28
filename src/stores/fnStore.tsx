import { create } from "zustand";
import { getAllImageFns } from "@/services";
import { ImageFunctionProps } from "@/interfaces/image-function";
import { ToastFunction } from "@/hooks/useToast";

interface FnStoreProps {
  isFetching: boolean;
  imageFunctions: ImageFunctionProps[];
  setImageFunctions: (imageFunctions: ImageFunctionProps[]) => void;
  getImageFunctions: (locale: string) => Promise<void>;

  currentGenerationIdRef: { job_id: string; id: number };
  setCurrentGenerationIdRef: (ref: { job_id: string; id: number }) => void;

  toast: ToastFunction | null;
}

export const useFnStore = create<FnStoreProps>((set) => ({
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

  currentGenerationIdRef: { job_id: "", id: 0 },
  setCurrentGenerationIdRef: (ref) => set({ currentGenerationIdRef: ref }),

  toast: null,
}));
