"use client";

import RootBanner from "../organisms/RootBanner";
import { MdEmail } from "react-icons/md";
import { useRootStore } from "@/zustand-stores";
import MessageCard from "../organisms/EmailSendedMessage";

export default function ForgotPasswordConfirmation() {
  const { setRootControl, emailSended } = useRootStore();

  return (
    <div className="min-h-screen w-screen flex items-center">
      {emailSended === "register" && (
        <MessageCard
          icon={<MdEmail className="text-secondary text-6xl mb-4" />}
          title="E-mail enviado com sucesso 👍"
          description="Um e-mail com link para confirmação de cadastro chegou na sua caixa de entrada. Clique no link do e-mail e conheça a Vestiq!"
          extraText="Se você não encontrar o e-mail, verifique sua pasta de spam."
          buttonText="Voltar ao Login"
          onButtonClick={() => setRootControl("login")}
        />
      )}

      {emailSended === "forgot-password" && (
        <MessageCard
          icon={<MdEmail className="text-secondary text-6xl mb-4" />}
          title="E-mail enviado com sucesso 👍"
          description="Um e-mail com link para redefinição de senha chegou na sua caixa de entrada. Clique no link do e-mail e redefina sua senha!"
          extraText="Se você não encontrar o e-mail, verifique sua pasta de spam."
          buttonText="Voltar ao Login"
          onButtonClick={() => setRootControl("login")}
        />
      )}

      <div className="rounded-l-[60px] bg-primary-background h-screen w-[50%] flex items-center justify-center max515:hidden">
        <RootBanner />
      </div>
    </div>
  );
}
