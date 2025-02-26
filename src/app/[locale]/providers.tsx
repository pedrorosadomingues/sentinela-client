/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { useUserStore } from "@/stores";
import { usePathname } from "next/navigation";
import VestiqWrapper from "@/components/templates/wrappers/VestiqWrapper";
import VestiqLoading from "@/components/organisms/VestiqLoading";
import { axiosInternalClient } from "@/lib/axios/axiosClient";

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
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const pathname = usePathname();

  // 🔹 Rotas privadas
  const privateRoutes = ["/main"];
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  const isPrivateRoute = privateRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // 🔹 Função para buscar o usuário autenticado via API interna
  const fetchSession = async () => {
    if (!user && isPrivateRoute) {
      setIsFetchingUser(true);

      try {
        const response = await axiosInternalClient.get("/user", {
          withCredentials: true, // 🔹 Garante que os cookies sejam enviados na requisição
        });

        if (response.data) {
          setUser(response.data.session_user); // 🔹 Define o usuário no Zustand
        }
      } catch (error) {
        console.error("❌ Erro ao buscar sessão:", error);
      } finally {
        setIsFetchingUser(false);
      }
    }
  };

  useEffect(() => {
    fetchSession();
  }, [locale]);

  // 🔹 Exibe loading enquanto busca a sessão
  if (isPrivateRoute && isFetchingUser) {
    return <VestiqLoading />;
  }

  // 🔹 Se for uma rota privada e o usuário estiver autenticado, coloca o conteúdo dentro do VestiqWrapper
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
