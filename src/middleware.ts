/* eslint-disable @typescript-eslint/no-unused-vars */
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./lib/i18n/routing";
import { validateUserToken } from "./services/auth/token";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const response = handleI18nRouting(req);
  const { pathname } = req.nextUrl;
  const locale = req.cookies.get("NEXT_LOCALE")?.value || "pt";
  const token = req.cookies.get("vq-access-token")?.value;

  const privateRoutes = ["/main"]; // 🔹 Rotas privadas
  const authRoutes = ["/auth"]; // 🔹 Rotas de autenticação

  // 🔹 Remove o prefixo do idioma da rota para comparação exata
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  const isPrivateRoute = privateRoutes.some((route) => pathWithoutLocale === route);
  const isAuthRoute = authRoutes.some((route) => pathWithoutLocale === route);

  // 🔹 Se for uma rota privada, validamos o token e o usuário
  if (isPrivateRoute) {
    const sessionUser = await validateUserToken(token);

    if (!sessionUser) {
      return NextResponse.redirect(new URL(`/${locale}/auth`, req.url));
    }
  }

  // 🔹 Se for uma rota de autenticação e o usuário já estiver logado, redireciona para /main
  if (isAuthRoute && token) {
    const sessionUser = await validateUserToken(token);

    if (sessionUser) {
      return NextResponse.redirect(new URL(`/${locale}/main`, req.url));
    }
  }

  // 🔹 Se estiver na raiz ("/"), redireciona para /auth
  if (pathWithoutLocale === "/") {
    return NextResponse.redirect(new URL(`/${locale}/auth`, req.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"], // Impede que o middleware modifique chamadas para "/api/"
};
