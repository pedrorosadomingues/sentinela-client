"use client";

import { useState } from "react";
import ForgotPassForm from "@/components/organisms/DynamicForm";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import RootBanner from "../organisms/RootBanner";
import { useLocale, useTranslations } from "next-intl";
import { requestResetPassword } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRootStore } from "@/zustand-stores";

export default function ForgotPassword() {
  const locale = useLocale();

  const text = useTranslations("sign_up_page");

  const { setEmailSended, setRootControl } = useRootStore();

  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] = useState<Record<string, string> | null>(
    null
  );

  const forgotPasswordSchema = z.object({
    email: z.string().email("E-mail inválido"),
  });

  type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

  const {
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleRequestResetPass: SubmitHandler<
    ForgotPasswordFormValues
  > = async (values) => {
    setLoading(true);

    setServerError(null);

    try {
      const response = await requestResetPassword({ ...values, locale });

      console.log("response", response);

      if (response.status === 400) {
        setServerError({ general: "Email não cadastrado" });
      }

      if (response.status === 200) {
        setRootControl("success-email-sended");

        setEmailSended("forgot-password");
      }
    } catch (error) {
      console.error(error);

      setServerError({ message: "Erro ao solicitar redefinição de senha." });
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
            error: errors.email?.message as string,
          },
        ]}
        server_error={serverError}
      />

      <div className="rounded-l-[60px] bg-primary-background h-screen w-[50%] flex items-center justify-center max515:hidden">
        <RootBanner />
      </div>
    </div>
  );
}
