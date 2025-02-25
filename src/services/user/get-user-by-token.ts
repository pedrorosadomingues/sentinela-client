import axios from "axios";

export async function getUserByToken(token: string) {
  try {
    console.log("📌 Chamando API interna para obter usuário...");
    console.log("📌 Enviando token manualmente:", token);

    const response = await axios.get("/api/user", {
      headers: {
        Authorization: `Bearer ${token}`, // 🔹 Enviando token no cabeçalho
      },
      withCredentials: true, // 🔹 Ainda tenta enviar cookies, se estiverem disponíveis
    });

    console.log("✅ Usuário carregado no client:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    return null;
  }
}
