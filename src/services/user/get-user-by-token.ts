import axios from "axios";

export async function getUserByToken() {
  try {
    console.log("📌 Chamando API interna para obter usuário...");

    const response = await axios.get("/api/user", {
      withCredentials: true, // 🔹 Garante que os cookies sejam enviados
    });

    console.log("✅ Usuário carregado no client:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    return null;
  }
}
