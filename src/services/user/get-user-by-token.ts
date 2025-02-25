import { cookies } from "next/headers";

export async function getUserByToken() {
  // 🔹 Obtém o token diretamente dos cookies no servidor
  const token = cookies().get("vq-access-token")?.value;

  if (!token) {
    console.log("🚨 Nenhum token encontrado nos cookies.");
    return null;
  }

  try {
    console.log("📌 Buscando usuário na API com token:", token);

    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/auth/get-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    console.log("📌 Resposta da API:", response.status, response.statusText);

    if (!response.ok) {
      console.log("🚨 Erro ao buscar usuário: resposta não OK");
      return null;
    }

    const data = await response.json();
    console.log("✅ Usuário recebido da API:", data);

    return data;
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    return null;
  }
}
