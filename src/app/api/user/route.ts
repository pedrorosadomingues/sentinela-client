/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    console.log("📌 [API Next.js] Recebendo requisição GET /api/user");

    // 🔹 Obtém todos os cookies para depuração
    const allCookies = cookies();
    console.log("📌 Cookies recebidos no servidor:", allCookies);

    // 🔹 Obtém o token do cookie específico
    const token = allCookies.get("vq-access-token")?.value;
    console.log("📌 Token obtido do cookie:", token);

    if (!token) {
      console.log("🚨 Nenhum token encontrado nos cookies.");
      return NextResponse.json({ error: "Token não encontrado." }, { status: 401 });
    }

    console.log("📌 Token encontrado, chamando API externa para validação...");

    // 🔹 Faz a requisição para validar o token e obter os dados do usuário
    const apiResponse = await fetch(
      `https://${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/auth/get-user`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    console.log("📌 Resposta da API externa:", apiResponse.status, apiResponse.statusText);

    if (!apiResponse.ok) {
      console.error("🚨 Erro ao buscar usuário na API externa:", await apiResponse.text());
      return NextResponse.json({ error: "Falha ao buscar usuário." }, { status: apiResponse.status });
    }

    const userData = await apiResponse.json();
    console.log("✅ Usuário carregado com sucesso:", userData);

    return NextResponse.json(userData);
  } catch (error) {
    console.error("❌ Erro no servidor da API interna:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
