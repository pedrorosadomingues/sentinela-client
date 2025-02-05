/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { login } from "@/services";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import RootBanner from "@/components/organisms/RootBanner";
import AuthForm from "@/components/organisms/DynamicForm";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInParams } from "@/services";

// 🔹 Definição do esquema de validação com Zod
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// 🔹 Definição do tipo do formulário
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginTemplate(): JSX.Element {
  const locale = useLocale();
  const text = useTranslations("sign_in_page");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<Record<string, string> | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Configuração do React Hook Form com Zod
  const {
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // ✅ Função de Login com tratamento de erros do backend
  const handleLogin: SubmitHandler<LoginFormValues> = async (values) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await login(values);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", response.data.user.id);
        localStorage.setItem("user_name", response.data.user.name);
        window.location.href = `/${locale}/main`;
      } else {
        setServerError({ general: text("invalid_email_or_password") });
      }
    } catch (error: any) {
      console.error("Erro de login:", error);

      if (error.response?.status === 401) {
        setServerError({
          email: text("invalid_email_or_password"),
          password: text("invalid_email_or_password"),
        });
      } else {
        toast.error("Erro inesperado ao fazer login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (token) {
    redirect(`/${locale}/main`);
  }

  return (
    <div className="min-h-screen w-screen flex items-center">
      <AuthForm<LoginFormValues>
        title={text("login")}
        buttonText={text("login") + ">>"}
        schema={loginSchema}
        onSubmit={handleLogin}
        isLoading={isLoading}
        fields={[
          {
            name: "email",
            label: text("email"),
            type: "email",
            required: true,
          },
          {
            name: "password",
            label: text("password"),
            type: "password",
            required: true,
          },
        ]}
        serverError={serverError}
      />

      <div className="rounded-l-[60px] bg-primary-background h-screen w-[50%] flex items-center justify-center max515:hidden">
        <RootBanner />
      </div>
    </div>
  );
}
