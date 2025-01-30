import { useUserStore } from "@/zustand-stores";
import api from "@/config/server";

export async function updateCoins(): Promise<void> {
    const { user, handleUpdateCoins } = useUserStore.getState();
    try {
        const response = await api.get(`/user/active-coins/${user?.id}`);

        if (response.status === 200 && response.data) {
            handleUpdateCoins(response.data);
        }

    } catch (error) {
        console.error("Error updating coins:", error);
    };
}