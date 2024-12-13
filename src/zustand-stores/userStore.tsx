import { create } from "zustand";
import { User, GetUserByIdParams } from "@/interfaces";
import { getUserById } from "@/services";

interface UserStore {
  user: User | null | object;
  setUser: (user: User | null) => void;
  getUser: ({ user_id }: GetUserByIdParams) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {},
  setUser: (user: User | null) => set({ user }),
  getUser: async ({ user_id }) => {
    const response = await getUserById({ user_id });
    if (response.status === 200) {
      set({ user: response.data });
    } else {
      console.error(response.message);
    }
  },
}));
