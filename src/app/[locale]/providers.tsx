/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { useImageFunctionStore, useUserStore } from "@/stores";
import { usePathname } from "next/navigation";
import { getUserByToken } from "@/services/user/get-user-by-token";
import VestiqWrapper from "@/components/templates/wrappers/VestiqWrapper";
import VestiqLoading from "@/components/organisms/VestiqLoading";

export default function Providers({
  children,
  messages,
  timeZone,
  locale,
}: {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  timeZone: string;
  locale: string;
}) {
  const { user, setUser } = useUserStore();
  const { imageFunctions, getImageFunctions } = useImageFunctionStore();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // 🔹 Rotas privadas
  const privateRoutes = ["/main"];
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  const isPrivateRoute = privateRoutes.some((route) => pathWithoutLocale.startsWith(route));

  // 🔹 Busca o usuário ao carregar o Provider
  useEffect(() => {
    const fetchSession = async () => {
      if (!user && isPrivateRoute) {
        console.log("📌 Buscando sessão via API interna...");
        const session = await getUserByToken();
        console.log("📌 Sessão carregada no Providers:", session);

        if (session) {
          setUser(session.session_user);
        }
      }
      setLoading(false);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (imageFunctions.length === 0) {
      getImageFunctions(locale as string);
    }
  }, [locale]);

  useEffect(() => {
    console.log("Usuário carregado do Zustand:", user);
  }, [user]);

  // 🔹 Exibe loading enquanto busca a sessão
  if (isPrivateRoute && loading) {
    return <VestiqLoading />;
  }

  // 🔹 Se for uma rota privada e o usuário estiver autenticado, coloca o conteúdo dentro do VestiqWrapper
  const content = isPrivateRoute ? <VestiqWrapper>{children}</VestiqWrapper> : children;

  return (
    <NextIntlClientProvider timeZone={timeZone} messages={messages} locale={locale}>
      <HeroUIProvider>{content}</HeroUIProvider>
    </NextIntlClientProvider>
  );
}
