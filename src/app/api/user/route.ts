/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    console.log("📌 [API Next.js] Recebendo requisição GET /api/user");

    const token = cookies().get("vq-access-token")?.value;
    console.log("📌 Token obtido do cookie:", token);

    if (!token) {
      console.log("🚨 Nenhum token encontrado nos cookies.");
      return NextResponse.json({ error: "Token não encontrado." }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL;
    console.log("📌 URL da API externa:", apiUrl);

    if (!apiUrl) {
      console.error("🚨 Erro: A variável NEXT_PUBLIC_REACT_APP_API_BASE_URL não está definida!");
      return NextResponse.json({ error: "Erro de configuração: API URL não definida." }, { status: 500 });
    }

    const endpoint = `https://${apiUrl}/auth/get-user`;
    console.log("📌 Endpoint da requisição:", endpoint);

    // 🔹 Teste adicional: chamar a API com timeout para capturar possíveis bloqueios
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos

    const apiResponse = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: controller.signal, // Adicionando timeout
    });

    clearTimeout(timeoutId); // Cancela o timeout se a requisição for bem-sucedida

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
