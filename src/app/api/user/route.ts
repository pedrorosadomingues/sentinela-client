// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function GET() {
//   try {
//     // 🔹 Obtém todos os cookies para depuração
//     const allCookies = cookies();

//     // 🔹 Obtém o token do cookie específico
//     const token = allCookies.get("vq-access-token")?.value;

//     if (!token) {
//       return NextResponse.json({ error: "Token não encontrado." }, { status: 401 });
//     }

//     // 🔹 Faz a requisição para validar o token e obter os dados do usuário
//     const apiResponse = await fetch(
//       `https://${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/get-user`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//         cache: "no-store",
//       }
//     );

//     if (!apiResponse.ok) {
//       console.error("🚨 Erro ao buscar usuário na API externa:", await apiResponse.text());
//       return NextResponse.json({ error: "Falha ao buscar usuário." }, { status: apiResponse.status });
//     }

//     const userData = await apiResponse.json();

//     return NextResponse.json(userData);
//   } catch (error) {
//     console.error("❌ Erro no servidor da API interna:", error);
//     return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
//   }
// }
