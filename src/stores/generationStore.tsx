/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
//import { Generation } from "@/interfaces/generation";
import { deleteGeneration, getAllGenerations } from "@/services";
import { Generation } from "@/interfaces";
import { downloadFiles } from "@/services/download/create";

interface Generations extends Generation {
  checked?: boolean;
  hidden?: boolean;
}

interface IGenerationStore {
  isFetching: boolean;
  generations: Generations[] | null;
  setGenerations: (generations: Generations[] | null) => void;
  getGenerations: () => Promise<void>;

  selectedGenerations: number[] | null;
  setSelectedGenerations: (selectedGenerations: number[] | null) => void;
  clearSelectedGenerations: () => void;
  handleSelectAllGenerations: () => void;
  handleDeleteSelectedGenerations: (options: {
    mode: "single" | "multiple";
    data?: number[];
  }) => Promise<void>;
  handleDownloadSelectedGenerations: (options: {
    mode: "single" | "multiple";
    data?: number[];
  }) => Promise<void>;
  handleMoveSelectedGenerations: () => Promise<void>;
}

export const useGenerationStore = create<IGenerationStore>((set) => ({
  isFetching: false,
  generations: null,
  setGenerations: (generations) => set({ generations }),
  getGenerations: async () => {
    set({ isFetching: true });

    try {
      const response = await getAllGenerations();

      if (response.status === 200) {
      set({ generations: response.data });
      } else {
      console.error(response.message);
      }
    } catch (error) {
      console.error("Failed to fetch generations", error);
    } finally {
      set({ isFetching: false });
    }
  },

  selectedGenerations: [],
  setSelectedGenerations: (selectedGenerations) => set({ selectedGenerations }),

  clearSelectedGenerations: () => {
    const { generations, setSelectedGenerations, setGenerations } =
      useGenerationStore.getState();

    const updatedGenerations = generations?.map((item: Generations) => ({
      ...item,
      checked: false,
    }));

    const selectedGenerationIds = updatedGenerations
      ?.filter((item: Generations) => item.checked)
      .map((item: Generations) => item.id);

    setSelectedGenerations(selectedGenerationIds || []);
    setGenerations(updatedGenerations || []);
  },

  handleSelectAllGenerations: () => {
    const { generations, setGenerations, setSelectedGenerations } =
      useGenerationStore.getState();

    const updatedGenerations = generations?.map((item: Generations) => ({
      ...item,
      checked: true,
    }));

    const selectedGenerationIds = updatedGenerations
      ?.filter((item: Generations) => item.checked)
      .map((item: Generations) => item.id);

    setSelectedGenerations(selectedGenerationIds || []);
    setGenerations(updatedGenerations || []);
  },

  handleDeleteSelectedGenerations: async (options) => {
    console.log("Delete selected generations", options);
    const { generations, setGenerations, selectedGenerations } =
      useGenerationStore.getState();
    
      console.log("selected generations", selectedGenerations);

    if (options.mode === "single" && options.data !== undefined) {
      const res = await deleteGeneration(options.data as number[]);

      if (res.status === 200) {
        const updatedGenerations = generations?.filter(
          (item: Generations) => options.data && item.id !== options.data[0]
        );

        setGenerations(updatedGenerations || []);
      } else {
        console.error("Failed to delete generation");
      }
    } else if (options.mode === "multiple" && selectedGenerations) {
      const res = await deleteGeneration(selectedGenerations);

      if (res.status === 200) {
        const updatedGenerations = generations?.filter(
          (item: Generations) => !selectedGenerations.includes(item.id)
        );

        setGenerations(updatedGenerations || []);
      } else {
        console.error("Failed to delete generations");
      }
    }
  },

  handleDownloadSelectedGenerations: async (options) => {
    const { selectedGenerations, generations } = useGenerationStore.getState();

    const isZip =
      (selectedGenerations && selectedGenerations?.length > 1) ||
      (options.data && options.data?.length > 1);
    const currentTimeStamp = new Date().getTime();
    let filesToDownload: string[];

    if (options.mode === "single" && options.data !== undefined) {
      const filteredPath = generations?.find(
        (item: Generation) => options.data && item.id === options.data[0]
      )?.path;

      filesToDownload = filteredPath ? [filteredPath] : [];
    } else {
      const filteredSelectedPaths = generations?.map((id) => {
        const generation = useGenerationStore
          .getState()
          .generations?.find((item) => selectedGenerations?.includes(item.id));
        return generation?.path || "";
      });

      filesToDownload = filteredSelectedPaths || [];
    }

    if (!filesToDownload || filesToDownload.length === 0) {
      return;
    }

    await downloadFiles(filesToDownload, {
      asZip: isZip,
      filename: `generations-${currentTimeStamp}-vestiq`,
    });
  },

  handleMoveSelectedGenerations: async () => {
    const { selectedGenerations } = useGenerationStore.getState();

    if (selectedGenerations) {
      console.log("Move selected generations", selectedGenerations);
    }
  },
}));
