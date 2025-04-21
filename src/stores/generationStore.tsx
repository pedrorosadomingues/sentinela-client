/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
//import { Generation } from "@/interfaces/generation";
import { deleteGeneration, getAllGenerations } from "@/services";
import { Generation } from "@/interfaces";
import { downloadFiles } from "@/services/download/create";

interface Generations extends Generation {
  batch_paths: any;
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

  sortedGenerations: Generations[] | null;
  setSortedGenerations: (sortedGenerations: Generations[] | null) => void;
  sortGenerations: (order: "newest-editions" | "oldest-editions") => void;

  filterGenerations: (filter: string) => void;

  isCheckedSelectAllBtn: boolean;
  setIsCheckedSelectAllBtn: (isCheckedSelectAllBtn: boolean) => void;

  generationsWithoutPaste: Generations[] | null;
  setGenerationsWithoutPaste: (generations: Generations[] | null) => void;
}

export const useGenerationStore = create<IGenerationStore>((set) => ({
  isFetching: false,
  generations: null,
  sortedGenerations: null,
  setGenerations: (generations) => set({ generations }),
  setSortedGenerations: (sortedGenerations) => set({ sortedGenerations }),
  getGenerations: async () => {
    set({ isFetching: true });

    try {
      const response = await getAllGenerations();

      if (response.status === 200) {
        set({
          generations: response.data?.map((item: Generation) => ({
            ...item,
            batch_paths: item.batch_paths || [],
          })),
        });
        set({
          sortedGenerations: response.data?.map((item: Generation) => ({
            ...item,
            batch_paths: item.batch_paths || [],
          })),
        });
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
    const { generations, setGenerations, selectedGenerations } =
      useGenerationStore.getState();

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

      console.log("FILES TO DOWNLOAD: ", filesToDownload);
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

  sortGenerations: (order: "newest-editions" | "oldest-editions") => {
    const { generations, setSortedGenerations } = useGenerationStore.getState();

    if (generations) {
      const ssortedGenerations = [...generations].sort((a, b) => {
        const dateA = new Date(a.id).getTime();
        const dateB = new Date(b.id).getTime();

        return order === "newest-editions" ? dateB - dateA : dateA - dateB;
      });

      setSortedGenerations(ssortedGenerations);
    }
  },

  filterGenerations: (filter: string) => {
    const { generations, setGenerations } = useGenerationStore.getState();
    const now = new Date();
  
    const parseBRDate = (brDate: string) => {
      const [datePart, timePart] = brDate.split(' ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hour, minute, second] = timePart.split(':').map(Number);
  
      return new Date(year, month - 1, day, hour, minute, second);
    };
  
    const dateFilterMap: Record<string, Date> = {
      today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      yesterday: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
      'last-30-days': new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30),
      'last-90-days': new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90),
      'last-year': new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
      'any-time': new Date(0),
    };
  
    const filterDate = dateFilterMap[filter.toLowerCase()];
  
    if (generations && filterDate) {
      const filteredGenerations = generations.map((item) => {
        const itemDate = parseBRDate(item.started_at);
        let hidden = itemDate < filterDate;
  
        if (filter.toLowerCase() === 'yesterday') {
          hidden =
            itemDate < filterDate ||
            itemDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (filter.toLowerCase() === 'today') {
          hidden = itemDate < filterDate;
        }
  
        return {
          ...item,
          hidden,
        };
      });
  
      setGenerations(filteredGenerations);
    }
  },

  isCheckedSelectAllBtn: false,
  setIsCheckedSelectAllBtn: (isCheckedSelectAllBtn) =>
    set({ isCheckedSelectAllBtn }),

  generationsWithoutPaste: null,
  setGenerationsWithoutPaste: (generations) =>
    set({ generationsWithoutPaste: generations }),
}));
