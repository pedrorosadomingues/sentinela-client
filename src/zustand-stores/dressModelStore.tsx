import { create } from "zustand";

interface DressModelStoreProps {
  step: number;
  current: "model" | "garment" | "result" | "generated";
  setStep: (step: number) => void;
}
export const useDressModelStore = create<DressModelStoreProps>((set) => ({
  step: 0,
  current: "model",

  setStep: (step) => {
    const current = (["model", "garment", "result", "generated"][step] ||
      "model") as "model" | "garment" | "result" | "generated";

    set(() => ({ step, current }));
  },
}));
