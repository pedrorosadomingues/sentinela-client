import { create } from "zustand";
import { getUserById } from "@/services";
import { UserProps } from "@/interfaces";

interface UserStore {
  user: UserProps | null;
  setUser: (user: UserProps | null) => void;
  getUser: (user_id: number | string) => Promise<void>;
  handleUpdateCoins: (current: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: UserProps | null) => set({ user }),
  getUser: async (user_id) => {
    const response = await getUserById({ user_id });

    if (response.status === 200 && response.data) {
      set({ user: response.data });
    } else {
      console.error(response.message);
    }
  },
  handleUpdateCoins: (current) => {
    set((state) => {
      if (state.user) {
        return {
          user: {
            ...state.user,
            v_coins: {
              ...state.user.v_coins,
              current: current,
            },
          },
        };
      }
      return state;
    });
  },
}));
