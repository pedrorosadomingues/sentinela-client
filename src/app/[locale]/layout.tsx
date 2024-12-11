/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import LanguageSwitcher from "@/components/organisms/LanguageSwitcher";
import ConfirmationModal from "@/components/organisms/ConfirmationModal";

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
    <div lang={locale}>
      <div>
        <NextIntlClientProvider messages={messages}>
          <ConfirmationModal />
          <LanguageSwitcher />
          {children}
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
