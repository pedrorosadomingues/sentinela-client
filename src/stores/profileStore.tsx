import { create } from "zustand";

interface ProfileStoreProps {
  profileControl: string;
  setProfileControl: (control: string) => void;
}

export const useProfileStore = create<ProfileStoreProps>((set) => ({
  profileControl: "perfil do usuário",
  setProfileControl: (control: string) => set({ profileControl: control }),

}));
