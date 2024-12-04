import { create } from "zustand";
import { Generation } from "@/interfaces/generation";
import { getAllGenerations } from "@/services";

interface GenerationStore {
  generations: [Generation];
  setGenerations: (generations: [Generation]) => void;
  getGenerations: () => Promise<void>;
}

export const useGenerationStore = create<GenerationStore>((set) => ({
  generations: [
    {
      id: 0,
      params_fashn: {},
      started_at: "",
      ended_at: "",
      fn: "",
      status: "",
      path: "",
      model_image_path: "",
      garment_image_path: "",
      error_message: "",
      deleted_at: "",
      generation_id: "",
      user_id: 0,
    },
  ],
  setGenerations: (generations: [Generation]) => set({ generations }),
  getGenerations: async () => {
    const response = await getAllGenerations();
    console.log("response", response);
    if (response.status === 200) {
      set({ generations: response.data });
    } else {
      console.error(response.message);
    }
  },
}));
