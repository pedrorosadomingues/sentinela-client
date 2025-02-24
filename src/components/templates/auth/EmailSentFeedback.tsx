"use client";

import { MdEmail } from "react-icons/md";
import { useRootStore } from "@/stores";
import MessageCard from "@/components/organisms/EmailSendedMessage";

export function EmailSentFeedback() {
  const { emailSended } = useRootStore();

  return (
    <>
      {emailSended === "register" && (
        <MessageCard
          icon={<MdEmail className="text-secondary text-6xl mb-4" />}
          title="E-mail enviado"
          description="Seu e-mail foi enviado com sucesso! Verifique sua caixa de entrada para obter mais instruções sobre os próximos passos. Se não encontrar o e-mail, lembre-se de verificar a pasta de spam ou lixo eletrônico, pois às vezes nossas mensagens podem acabar lá por engano. Caso precise de mais ajuda, entre em contato com nossa equipe de suporte."
          extraText="Se você não encontrar o e-mail, verifique sua pasta de spam."
          buttonText="Voltar ao Login"
          onButtonClick={() => window.location.replace("/")}
        />
      )}

      {emailSended === "forgot-password" && (
        <MessageCard
          icon={<MdEmail className="text-secondary text-6xl mb-4" />}
          title="E-mail enviado"
          description="Seu e-mail foi enviado com sucesso! Verifique sua caixa de entrada para obter mais instruções sobre os próximos passos. Se não encontrar o e-mail, lembre-se de verificar a pasta de spam ou lixo eletrônico, pois às vezes nossas mensagens podem acabar lá por engano. Caso precise de mais ajuda, entre em contato com nossa equipe de suporte."
          extraText="Se você não encontrar o e-mail, verifique sua pasta de spam."
          buttonText="Voltar ao Login"
          onButtonClick={() => window.location.replace("/")}
        />
      )}
    </>
  );
}
