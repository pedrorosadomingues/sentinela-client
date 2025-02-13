import { Tables } from "@/lib/supabase/types";
import { create } from "zustand";

export interface ModelCustomizationsProps {
  gender: "male" | "female" | null;
  skinTone: string;
  eyeShape: "small" | "medium" | "large" | "almond";
  eyeColor: "blue" | "green" | "brown" | "black" | "gray";
  hairStyle:
    | "short"
    | "long"
    | "braided"
    | "straight"
    | "curly"
    | "afro"
    | "black_power"
    | "shaved";
  hairColor:
    | "black"
    | "brown"
    | "blonde"
    | "red"
    | "gray"
    | "green"
    | "blue"
    | "colored";
  age: "child" | "teen" | "adult" | "elderly";
  facialHair?: "no_beard" | "goatee" | "full_beard" | "mustache";
  facialHairColor?:
    | "black"
    | "brown"
    | "blonde"
    | "red"
    | "gray"
    | "green"
    | "blue"
    | "colored";
  height: "short" | "medium" | "tall";
  bodyType: "slim" | "athletic" | "muscular" | "plus_size";
}

interface CreateModelStoreProps {
  step: number;
  setStep: (step: number) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;

  selectedModel: string | null;
  setSelectedModel: (selectedModel: string | null) => void;

  selectedCustomizations: ModelCustomizationsProps | null;
  setSelectedCustomizations: (
    customizations: Partial<ModelCustomizationsProps>
  ) => void;

  generatedModel: string | null;
  setGeneratedModel: (generatedModel: string | null) => void;

  defaultModels: Tables<"models_default">[] | null;
  setDefaultModels: (defaultModels: Tables<"models_default">[] | null) => void;

  modelSuggestions: Tables<"models_suggestions">[] | null;
  setModelSuggestions: (
    modelSuggestions: Tables<"models_suggestions">[] | null
  ) => void;
}

export const useCreateModelStore = create<CreateModelStoreProps>((set) => ({
  step: 0,
  setStep: (step: number) => set({ step }),

  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onOpenChange: () => set((state) => ({ isOpen: !state.isOpen })),

  selectedModel: null,
  setSelectedModel: (selectedModel: string | null) =>
    set({ selectedModel: selectedModel }),

  selectedCustomizations: null,
  setSelectedCustomizations: (customizations) =>
    set((state) => ({
      selectedCustomizations: {
        ...state.selectedCustomizations,
        ...customizations,
      } as ModelCustomizationsProps,
    })),

  generatedModel: "https://heroui.com/images/hero-card.jpeg",
  setGeneratedModel: (generatedModel: string | null) =>
    set({ generatedModel: generatedModel }),

  defaultModels: null,
  setDefaultModels: (defaultModels) => set({ defaultModels }),

  modelSuggestions: null,
  setModelSuggestions: (modelSuggestions) => set({ modelSuggestions }),
}));
