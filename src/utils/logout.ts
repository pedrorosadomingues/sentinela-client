import { axiosClient } from "@/lib/axios/axiosClient";

export async function logout(): Promise<boolean> {
  try {
    const response = await axiosClient.get("/auth/logout", {
      withCredentials: true,
    });

    return response.data ?? false;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return false;
  }
}
