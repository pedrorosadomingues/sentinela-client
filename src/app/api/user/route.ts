import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 🔹 Obtém o token dos cookies no servidor
    const token = cookies().get("vq-access-token")?.value;

    if (!token) {
      console.log("🚨 Nenhum token encontrado nos cookies.");
      return NextResponse.json({ error: "Token não encontrado." }, { status: 401 });
    }

    console.log("📌 Token encontrado no servidor:", token);

    // 🔹 Faz a requisição para a API externa para buscar os dados do usuário
    const apiResponse = await fetch(
      `https://${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/auth/get-user`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    console.log("📌 Resposta da API:", apiResponse.status, apiResponse.statusText);

    if (!apiResponse.ok) {
      return NextResponse.json({ error: "Falha ao buscar usuário." }, { status: apiResponse.status });
    }

    const userData = await apiResponse.json();
    console.log("✅ Usuário carregado:", userData);

    return NextResponse.json(userData);
  } catch (error) {
    console.error("❌ Erro no servidor:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
