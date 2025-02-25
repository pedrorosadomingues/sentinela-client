/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { useImageFunctionStore, useUserStore } from "@/stores";
import { SessionUserProps } from "@/interfaces";
import { usePathname, useRouter } from "next/navigation";
import VestiqWrapper from "@/components/templates/wrappers/VestiqWrapper";

export default function Providers({
  children,
  messages,
  timeZone,
  locale,
  session,
}: {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  timeZone: string;
  locale: string;
  session: SessionUserProps | null;
}) {
  const { getUser } = useUserStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { imageFunctions, getImageFunctions } = useImageFunctionStore();

  // 🔹 Lista de rotas privadas (sem o prefixo do idioma)
  const privateRoutes = ["/main"];

  // 🔹 Remove o prefixo do idioma da rota antes da verificação
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  // 🔹 Verifica se alguma rota privada é um PREFIXO da URL atual (ex: /main/generations)
  const isPrivateRoute = privateRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  useEffect(() => {
    if (session) {
      getUser(session.session_user.id);
      setIsAuthorized(true); // 🔹 Autoriza a renderização das rotas privadas
    } else if (isPrivateRoute) {
      // 🔹 Se for uma rota privada e não houver sessão, redireciona para /auth
      router.push(`/auth`);
    }
  }, [session, pathWithoutLocale]);

  useEffect(() => {
    if (imageFunctions.length === 0) {
      getImageFunctions(locale as string);
    }
  }, [locale]);

  // 🔹 Se a rota for privada e o usuário não estiver autorizado, não renderiza nada
  if (isPrivateRoute && !isAuthorized) {
    return null;
  } 

  // 🔹 Se a rota for privada e o usuário estiver autenticado, coloca o conteúdo dentro do VestiqWrapper
  const content = isPrivateRoute ? (
    <VestiqWrapper>{children}</VestiqWrapper>
  ) : (
    children
  );

  return (
    <NextIntlClientProvider
      timeZone={timeZone}
      messages={messages}
      locale={locale}
    >
      <HeroUIProvider>{content}</HeroUIProvider>
    </NextIntlClientProvider>
  );
}
