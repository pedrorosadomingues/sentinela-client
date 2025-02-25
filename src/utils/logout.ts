import { axiosInternalClient } from "@/lib/axios/axiosClient";
import { useUserStore } from "@/stores";

/**
 * Faz logout do usuário, remove o token do cliente e da API do Next.js.
 * @returns {Promise<boolean>} - `true` se o logout foi bem-sucedido, `false` caso contrário.
 */
export async function logout(): Promise<boolean> {
  const { setUser } = useUserStore.getState();

  try {
    // 🔹 Chama a API de logout para remover o token do servidor
    const response = await axiosInternalClient.get("/auth/logout", {
      withCredentials: true,
    });

    if (response.status === 200) {
      setUser(null);
    };
    // 🔹 Retorna o status do logout (true se bem-sucedido, false se falhar)
    return response.data?.status ?? false;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return false;
  }
}
