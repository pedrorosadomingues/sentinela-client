/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
//import { Generation } from "@/interfaces/generation";
import { getAllGenerations } from "@/services";

interface IGenerationStore {
  isFetching: boolean;
  generations: any[];
  setGenerations: (generations: any[]) => void;
  getGenerations: () => Promise<void>;

  selectedGenerations: number[];
  setSelectedGenerations: (selectedGenerations: any) => void;
  clearSelectedGenerations: () => void;
  handleSelectAllGenerations: () => void;
}

export const useGenerationStore = create<IGenerationStore>((set) => ({
  isFetching: false,
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
  setGenerations: (generations: any[]) => set({ generations }),
  getGenerations: async () => {
    set({ isFetching: true });

    const response = await getAllGenerations();

    if (response.status === 200) {
      set({ generations: response.data, isFetching: false });
    } else {
      console.error(response.message);
    }
  },

  selectedGenerations: [],
  setSelectedGenerations: (selectedGenerations: number[]) =>
    set({ selectedGenerations }),

  clearSelectedGenerations: () => {
    const {
      generations,
      setSelectedGenerations,
      setGenerations,
    } = useGenerationStore.getState();

    const updatedGenerations = generations?.map((item: any) => ({
      ...item,
      checked: false,
    }));

    const selectedGenerationIds = updatedGenerations
      .filter((item: any) => item.checked)
      .map((item: any) => item.id);

    setSelectedGenerations(selectedGenerationIds);
    setGenerations(updatedGenerations);
  },
  
  handleSelectAllGenerations: () => {
    const {
      generations,
      setGenerations,
      setSelectedGenerations,
    } = useGenerationStore.getState();

    const updatedGenerations = generations?.map((item: any) => ({
      ...item,
      checked: true,
    }));

    const selectedGenerationIds = updatedGenerations
      .filter((item: any) => item.checked)
      .map((item: any) => item.id);

    setSelectedGenerations(selectedGenerationIds);
    setGenerations(updatedGenerations);
  },

}));
