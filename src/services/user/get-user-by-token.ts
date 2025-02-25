import axios from "axios";

export async function getUserByToken(token: string) {
  try {
    const response = await axios.get("/api/user", {
      headers: {
        Authorization: `Bearer ${token}`, // 🔹 Enviando token no cabeçalho
      },
      withCredentials: true, // 🔹 Ainda tenta enviar cookies, se estiverem disponíveis
    });

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    return null;
  }
}
