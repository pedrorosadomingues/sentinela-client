/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import { HeroUIProvider } from "@heroui/react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { useImageFunctionStore, useUserStore } from "@/stores";
import { SessionUserProps } from "@/interfaces";
import { usePathname } from "next/navigation";
import VestiqWrapper from "@/components/templates/wrappers/VestiqWrapper";
import VestiqLoading from "@/components/organisms/VestiqLoading";

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

  // 🔹 Rotas privadas (sem o prefixo do idioma)
  const privateRoutes = ["/main"];
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  // 🔹 Verifica se a URL pertence a uma rota privada
  const isPrivateRoute = privateRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // 🔹 Se houver uma sessão, carrega o usuário no Zustand
  useEffect(() => {
    if (!user && session) {
      console.log("📌 Carregando usuário a partir da sessão...");
      setUser(session.session_user);
    }
  }, [session, user]);

  useEffect(() => {
    if (imageFunctions.length === 0) {
      getImageFunctions(locale as string);
    }
  }, [locale]);

  useEffect(() => {
    console.log("Usuário carregado do Zustand:", user);
  }, [user]);

  // 🔹 Enquanto a sessão não for carregada, exibe um loading
  if (isPrivateRoute && !user && session) {
    return <VestiqLoading />;
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
