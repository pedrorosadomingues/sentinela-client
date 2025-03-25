/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { HeroUIProvider } from "@heroui/react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { useUserStore } from "@/stores";
import { usePathname } from "next/navigation";
import VestiqWrapper from "@/components/templates/wrappers/VestiqWrapper";
import VestiqLoading from "@/components/organisms/VestiqLoading";
import { axiosClient } from "@/lib/axios/axiosClient";

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
  const hasFetchedUser = useRef(false);

  const privateRoutes = ["/main"];
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  const isPrivateRoute = privateRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  const fetchSession = async () => {
    if (hasFetchedUser.current || user || !isPrivateRoute) return;

    hasFetchedUser.current = true;
    setIsFetchingUser(true);

    try {
      const response = await axiosClient.get("/auth/get-user", {
        withCredentials: true,
      });

      if (response.data) {
        setUser(response.data.session_user);
      }
    } catch (error) {
      console.error("❌ Erro ao buscar sessão:", error);
    } finally {
      setIsFetchingUser(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [locale, isPrivateRoute]);

  if (isPrivateRoute && isFetchingUser) {
    return <VestiqLoading />;
  }

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
