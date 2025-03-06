import { create } from 'zustand';
import { getAllPlans } from "@/services";
import { Plan } from "@/interfaces";


interface IPlanStore {
  isFetching: boolean;
  plans: Plan[] | null;
  setPlans: (plans: Plan[] | null) => void;
  getPlans: () => Promise<void>;

  selectedPlan: string | null;
  setSelectedPlan: (selectedPlan: string | null) => void;
}

export const usePlanStore = create<IPlanStore>((set) => ({
  isFetching: false,
  plans: null,
  setPlans: (plans) => set({ plans }),
  getPlans: async () => {
    set({ isFetching: true });

    try {
      const response = await getAllPlans();

      if (response.status === 200) {
        set({ plans: response.data });
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      set({ isFetching: false });
    }
  },

  selectedPlan: null,
  setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
}));

