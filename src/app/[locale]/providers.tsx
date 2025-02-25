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
  const { user, setUser } = useUserStore();
  const { imageFunctions, getImageFunctions } = useImageFunctionStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 🔹 Rotas privadas (sem o prefixo do idioma)
  const privateRoutes = ["/main"];
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  // 🔹 Verifica se alguma rota privada é um PREFIXO da URL atual (ex: /main/generations)
  const isPrivateRoute = privateRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // 🔹 Função para verificar se há sessão e carregar o usuário
  const handleSessionCheck = async () => {
    if (user) {
      setIsAuthorized(true);
      console.log("✅ Usuário já está autenticado no Zustand.");
      return;
    }

    if (session) {
      console.log("📌 Carregando usuário a partir da sessão...");
      setUser(session.session_user);
      setIsAuthorized(true);
    } else if (isPrivateRoute) {
      console.log("🔴 Nenhuma sessão encontrada. Redirecionando para /auth");
      router.push(`/auth`);
    }
  };

  useEffect(() => {
    handleSessionCheck();
  }, [session, user]); // Executa apenas quando a sessão ou usuário mudar

  useEffect(() => {
    if (imageFunctions.length === 0) {
      getImageFunctions(locale as string);
    }
  }, [locale]);

  useEffect(() => {
    console.log("Usuário carregado do Zustand:", user);
  }, [user]);

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
