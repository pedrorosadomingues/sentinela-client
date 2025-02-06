/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import ConfirmationModal from "@/components/organisms/ConfirmationModal";
import Providers from "../providers";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <main lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <ConfirmationModal />
          {children}
        </Providers>
      </NextIntlClientProvider>
    </main>
  );
}
