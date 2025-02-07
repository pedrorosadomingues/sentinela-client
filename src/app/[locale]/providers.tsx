import React from "react";
import { HeroUIProvider } from "@heroui/react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

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
  return (
    <NextIntlClientProvider
      timeZone={timeZone}
      messages={messages}
      locale={locale}
    >
      <HeroUIProvider>{children}</HeroUIProvider>
    </NextIntlClientProvider>
  );
}
