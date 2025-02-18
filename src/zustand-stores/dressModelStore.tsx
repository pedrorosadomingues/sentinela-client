import { create } from "zustand";

interface DressModelStoreProps {
  step: number;
  current: "model" | "garment" | "result" | "generated";
  setStep: (step: number) => void;

  currentGeneration: {
    model: string;
    garment: string;
    result: string;
    isLoading: boolean;
  };

  setCurrentGeneration: (generation: {
    model: string;
    garment: string;
    result: string;
    isLoading: boolean;
  }) => void;

  setCurrentModelImage: (model: string) => void;
  setCurrentGarmentImage: (garment: string) => void;
  setCurrentResultImage: (result: string) => void;
  setImagesLoading: (isLoading: boolean) => void;

  modelImageControls: {
    cover_feet: boolean;
    adjust_hands: boolean;
    restore_clothes: boolean;
  };

  setModelImageControls: (controls: {
    cover_feet: boolean;
    adjust_hands: boolean;
    restore_clothes: boolean;
  }) => void;

  handleClearCurrentGeneration: () => void;

  handleDressTour: (idx: number) => void;
  handleExitDressTour: () => void;
}
export const useDressModelStore = create<DressModelStoreProps>((set) => ({
  step: 0,
  current: "model",

  setStep: (step) => {
    const current = (["model", "garment", "result", "generated"][step] ||
      "model") as "model" | "garment" | "result" | "generated";

    set(() => ({ step, current }));
  },

  currentGeneration: {
    model: "",
    garment: "",
    result: "",
    isLoading: false,
  },

  setCurrentGeneration: (generation) => {
    set(() => ({ currentGeneration: generation }));
  },

  setCurrentModelImage: (model) => {
    set((state) => ({
      currentGeneration: {
        ...state.currentGeneration,
        model: model,
      },
    }));
  },

  setCurrentGarmentImage: (garment) => {
    set((state) => ({
      currentGeneration: {
        ...state.currentGeneration,
        garment: garment,
      },
    }));
  },

  setCurrentResultImage: (result) => {
    set((state) => ({
      currentGeneration: {
        ...state.currentGeneration,
        result: result,
      },
    }));
  },

  setImagesLoading: (isLoading) => {
    set((state) => ({
      currentGeneration: {
        ...state.currentGeneration,
        isLoading: isLoading,
      },
    }));
  },
  
  handleClearCurrentGeneration: () => {
    set(() => ({
      currentGeneration: {
        model: "",
        garment: "",
        result: "",
        isLoading: false,
      },
    }));
  },

  modelImageControls: {
    cover_feet: false,
    adjust_hands: false,
    restore_clothes: false,
  },

  setModelImageControls: (controls) => {
    set(() => ({ modelImageControls: controls }));
  },

  handleDressTour: (idx) => {
    if (idx === 2) {
      set((state) => ({
        currentGeneration: {
          ...state.currentGeneration,
          model:
            "https://fcoyipufipefrxnqwqbs.supabase.co/storage/v1/object/public/models/female/dress-model-tour-model.png",
        },
      }));
    } else if (idx === 9) {
      set((state) => ({
        currentGeneration: {
          ...state.currentGeneration,
          garment:
            "https://fcoyipufipefrxnqwqbs.supabase.co/storage/v1/object/public/models/garment/dress-model-tour-garment.png",
        },
      }));
    } else if (idx === 13) {
      set((state) => ({
        currentGeneration: {
          ...state.currentGeneration,
          result:
            "https://fcoyipufipefrxnqwqbs.supabase.co/storage/v1/object/public/models/generated/dress-model-tour-result.png",
        },
      }));
    }
  },

  handleExitDressTour: () => {
    set(() => ({
      currentGeneration: {
        model: "",
        garment: "",
        result: "",
        isLoading: false,
      },
    }));
  },
}));
