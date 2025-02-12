"use client";

import RootBanner from "../organisms/RootBanner";
import { MdEmail } from "react-icons/md";
import { useRootStore } from "@/zustand-stores";
import MessageCard from "../organisms/EmailSendedMessage";
import { useRouter } from "next/navigation";

export default function ForgotPasswordConfirmation() {
  const { emailSended } = useRootStore();

  const router = useRouter();

  return (
    <div className="min-h-screen w-screen flex items-center">
      {emailSended === "register" && (
        <MessageCard
          icon={<MdEmail className="text-secondary text-6xl mb-4" />}
          title="E-mail enviado"
          description="Seu e-mail foi enviado com sucesso! Verifique sua caixa de entrada para obter mais instruções sobre os próximos passos. Se não encontrar o e-mail, lembre-se de verificar a pasta de spam ou lixo eletrônico, pois às vezes nossas mensagens podem acabar lá por engano. Caso precise de mais ajuda, entre em contato com nossa equipe de suporte."
          extraText="Se você não encontrar o e-mail, verifique sua pasta de spam."
          buttonText="Voltar ao Login"
          onButtonClick={() => router.push("/")}
        />
      )}

      {emailSended === "forgot-password" && (
        <MessageCard
          icon={<MdEmail className="text-secondary text-6xl mb-4" />}
          title="E-mail enviado"
          description="Seu e-mail foi enviado com sucesso! Verifique sua caixa de entrada para obter mais instruções sobre os próximos passos. Se não encontrar o e-mail, lembre-se de verificar a pasta de spam ou lixo eletrônico, pois às vezes nossas mensagens podem acabar lá por engano. Caso precise de mais ajuda, entre em contato com nossa equipe de suporte."
          extraText="Se você não encontrar o e-mail, verifique sua pasta de spam."
          buttonText="Voltar ao Login"
          onButtonClick={() => router.push("/")}
        />
      )}

      <div className="rounded-l-[60px] bg-primary-background h-screen w-[50%] flex items-center justify-center max515:hidden">
        <RootBanner />
      </div>
    </div>
  );
}
