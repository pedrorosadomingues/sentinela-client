import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 🔹 Obtém os cookies da requisição
    const token = req.cookies.get("vq-access-token")?.value;

    if (!token) {
      console.log("🚨 Nenhum token encontrado nos cookies.");
      return NextResponse.json({ error: "Token não encontrado." }, { status: 401 });
    }

    console.log("📌 Token encontrado:", token);

    // 🔹 Faz a requisição para a API externa
    const apiResponse = await fetch(
      `https://${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/auth/get-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    console.log("📌 Resposta da API:", apiResponse.status, apiResponse.statusText);

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: "Falha ao buscar usuário." },
        { status: apiResponse.status }
      );
    }

    // 🔹 Converte a resposta para JSON
    const userData = await apiResponse.json();
    console.log("✅ Usuário carregado:", userData);

    return NextResponse.json(userData);
  } catch (error) {
    console.error("❌ Erro no servidor:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
