import { create } from "zustand";

interface MyProfileStore {
  profileControl: string;
  setProfileControl: (control: string) => void;
}

export const useMyProfileStore = create<MyProfileStore>((set) => ({
  profileControl: "perfil do usuário",
  setProfileControl: (control: string) => set({ profileControl: control }),

}));
