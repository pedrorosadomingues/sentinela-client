/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axios/axiosClient";
import { create } from "zustand";

interface PasteStore {
  pastes: any;
  generationsObj: object;
  setPastes: (pastes: any) => void;
  setGenerationsObj: (generationsObj: any) => void;
  getPaste: (paste_id: string) => Promise<void>;
}

export const usePasteStore = create<PasteStore>((set) => ({
  generationsObj: {},
  setGenerationsObj: (generationsObj) => set({ generationsObj }),
  pastes: null,
  setPastes: (pastes) => set({ pastes }),
  getPaste: async (paste_id) => {
    if (!paste_id) return;

    const { setPastes, setGenerationsObj, generationsObj } = usePasteStore.getState();

    await axiosClient
      .get(`/paste/${paste_id}`)
      .then((res: any) => {
        setPastes(res.data);

        const generationsStance = { ...generationsObj } as any;

        if (res.data[0] && res.data[0].generations) {
          for (let i = 0; i < res.data[0].generations.length; i++) {
            generationsStance[res.data[0].generations[i].id] = false;
          }
        }

        setGenerationsObj(generationsStance);
      })
      .catch((err) => {
        return err;
      });
  },
}));
