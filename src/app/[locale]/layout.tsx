/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import ConfirmationModal from "@/components/organisms/ConfirmationModal";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { getMessages, getTimeZone } from "next-intl/server";
import { axiosInternalClient } from "@/lib/axios/axiosClient";
import { getUserByToken } from "@/services/user/get-user-by-token";

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
  const timeZone = await getTimeZone();
  const session = await getUserByToken();

  return (
    <main lang={locale}>
      <Providers
        messages={messages}
        timeZone={timeZone}
        locale={locale}
        session={session}
      >
        <ConfirmationModal />
        {children}
        <Toaster position="bottom-right" />
      </Providers>
    </main>
  );
}
