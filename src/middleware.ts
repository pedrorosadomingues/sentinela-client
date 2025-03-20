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
    return NextResponse.redirect(new URL(`/auth`, req.url));
  }

  // // 🔹 Validação de acesso às funções específicas
  // if (token && pathname.startsWith('/main/fns/')) {
  //   // Extrair a chave da função da URL
  //   const functionKey = pathname.split('/').pop();
    
  //   try {
  //     // Buscar dados do usuário a partir do token
  //     // Isso depende da sua implementação específica de autenticação
  //     const response = await validateUserToken(token);

  //     const userData = response.data;
  //     const user = userData.session_user;
      
  //     console.log(user)
  //     // Verificar se o usuário tem acesso à função solicitada
  //     const availableFunctions = Array.isArray(user?.plan?.available_resources)
  //       ? user.plan.available_resources.map((fn: string) => fn)
  //       : [];
      
  //     // Se o usuário não tiver acesso à função, redirecionar para o modal de upgrade
  //     if (!availableFunctions.includes(functionKey)) {
  //       // Redirecionar para a página principal com um parâmetro que indica que o modal de upgrade deve ser aberto
  //       const redirectUrl = new URL('/main', req.url);
  //       redirectUrl.searchParams.set('upgrade', 'true');
  //       return NextResponse.redirect(redirectUrl);
  //     }
  //   } catch (error) {
  //     console.error('Erro ao validar acesso à função:', error);
  //     // Em caso de erro, redirecionar para a página principal por segurança
  //     return NextResponse.redirect(new URL('/main', req.url));
  //   }
  // }

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
