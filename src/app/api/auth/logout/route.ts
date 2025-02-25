import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json(
    { status: true, message: "Logout realizado com sucesso!" },
    { status: 200 }
  );

  // 🔹 Remove o cookie do lado do servidor
  response.cookies.set("vq-access-token", "", {
    path: "/",
    expires: new Date(0), // Expira imediatamente
    httpOnly: true, // Evita acesso via JavaScript
    secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
    sameSite: "strict",
  });

  return response;
}
