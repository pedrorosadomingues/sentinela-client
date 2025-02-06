"use client";

import { useState } from "react";
import ForgotPassForm from "@/components/organisms/DynamicForm";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form";
import RootBanner from "../organisms/RootBanner";
import { useTranslations } from "next-intl";

export default function ForgotPassword() {
  const text = useTranslations("sign_up_page");

  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState<Record<
    string,
    string
  > | null>(null);

  const forgotPasswordSchema = z.object({
    email: z.string().email("E-mail inválido"),
  });

  type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

  const handleRequestResetPass: SubmitHandler<
    ForgotPasswordFormValues
  > = async (values) => {
    setLoading(true);
    setServerMessage(null);

    try {
      const response = await fetch("/api/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values }),
      });

      const data = await response.json();
      setServerMessage(
        data.message
          ? { message: data.message }
          : {
              message: "Se o e-mail estiver cadastrado, você receberá um link.",
            }
      );
    } catch (error) {
      console.error(error);
      setServerMessage({ message: "Erro ao solicitar redefinição de senha." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center">
        <ForgotPassForm<ForgotPasswordFormValues>
          title="Esqueci minha senha"
          subtitle="Insira seu endereço de e-mail abaixo. Você receberá um link para redefinir sua senha diretamente no seu e-mail."
          button_text={loading ? "Enviando..." : "Enviar e-mail"}
          have_account_text={text("have_account")}
          back_login_text={text("back_to_login")}
          schema={forgotPasswordSchema}
          onSubmit={handleRequestResetPass}
          isLoading={loading}
          fields={[
            {
              name: "email",
              label: "E-mail",
              type: "email",
              required: true,
              error: "",
            },
          ]}
          server_error={serverMessage}
        />

      <div className="rounded-l-[60px] bg-primary-background h-screen w-[50%] flex items-center justify-center max515:hidden">
        <RootBanner />
      </div>
    </div>
  );
}
