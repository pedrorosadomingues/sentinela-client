import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./lib/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const response = handleI18nRouting(req);
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("vq-access-token")?.value;

  const privateRoutes = ["/main"]; // 🔹 Rotas privadas
  const authRoutes = ["/auth"]; // 🔹 Rotas de autenticação

  const isPrivateRoute = privateRoutes.some((route) => pathname === route);
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // 🔹 Se for uma rota privada, validamos o token e o usuário
  if (isPrivateRoute && !token) {
    // const sessionUser = await validateUserToken(token);

    return NextResponse.redirect(new URL(`/auth`, req.url));
  }

  // 🔹 Se for uma rota de autenticação e o usuário já estiver logado, redireciona para /main
  if (isAuthRoute && token) {
    // const sessionUser = await validateUserToken(token);

    return NextResponse.redirect(new URL(`/main`, req.url));
  }

  // 🔹 Se estiver na raiz ("/"), redireciona para /auth
  if (pathname === "/" && !token) {
    return NextResponse.redirect(new URL(`/auth`, req.url));
  } else if (pathname === "/" && token) {
    return NextResponse.redirect(new URL(`/main`, req.url));
  };

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
