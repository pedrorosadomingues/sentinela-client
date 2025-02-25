/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import ConfirmationModal from "@/components/organisms/ConfirmationModal";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { getMessages, getTimeZone } from "next-intl/server";
import { headers } from "next/headers";

async function getUserFromToken(token: string | undefined) {
  if (!token) return null;

  try {
    // 🔹 Faz uma requisição para obter os dados do usuário
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/auth/get-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

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

  const headersList = headers();
  const cookieHeader = headersList.get("cookie");
  console.log("📌 Cookies recebidos no servidor:", cookieHeader); // 🔍 Debug

  // 🔹 Extraindo o vq-access-token manualmente do cookie
  const token = cookieHeader
    ?.split("; ")
    .find((row) => row.startsWith("vq-access-token="))
    ?.split("=")[1];

  console.log("📌 Token extraído manualmente:", token); // 🔍 Debug

  // 🔹 Obtém os dados da sessão a partir do token
  const session = await getUserFromToken(token);

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
