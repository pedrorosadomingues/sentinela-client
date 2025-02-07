/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ICON_MAPPING } from "@/constants/icons";
import { useImageFunctionStore } from "@/zustand-stores";
import { ImageFunctionProps } from "@/interfaces/image-function";
import { useLocale } from "next-intl";
import DynamicForm from "@/components/organisms/DynamicForm";
import { z } from "zod";
import { resetPassword } from "@/services";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LOCAL_ICON_MAPPING: any = ICON_MAPPING;

export default function ResetPasswordPage() {
  const router = useRouter();
  const locale = useLocale();
  const { code } = useParams() as { code: string };

  const { imageFunctions, getImageFunctions } = useImageFunctionStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [serverError, setServerError] = useState<Record<string, string> | null>(
    null
  );

  const resetPasswordSchema = z
    .object({
      new_password: z
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracteres"),
      password_confirmation: z
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracteres"),
    })
    .refine((data) => data.new_password === data.password_confirmation, {
      message: "As senhas não coincidem.",
      path: ["password_confirmation"],
    });

  type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

  useEffect(() => {
    getImageFunctions(locale);
  }, [getImageFunctions, locale]);

  const {
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleResetPassword: SubmitHandler<ResetPasswordFormValues> = async (
    values
  ) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await resetPassword({ ...values, code });

      if (response.status === 200) {
        alert("Senha redefinida com sucesso.");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setServerError({ general: "Token inválido ou expirado." });
      }
    } catch (error) {
      console.error(error);
      setServerError({ general: "Erro ao redefinir senha." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-[80%] m-auto">
      <div className="flex flex-col justify-center bg-white items-center max765:hidden w-[50%]">
        <div className="flex justify-start items-start w-[80%]">
          <Image
            src="/images/logo-vestiq.png"
            alt="Vestiq Logo"
            width={150}
            height={250}
            priority
            className="mb-6"
          />
        </div>

        <h1 className="text-4xl font-bold w-[80%]">
          A inteligência artificial que renova ensaios de moda
        </h1>
        <p className="mt-4 text-start text-gray-600 w-[80%]">
          Explore o melhor da Inteligência Artificial para lojas, moda e design.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-8 text-gray-800 w-[80%]">
          {imageFunctions?.map((func: ImageFunctionProps) => (
            <div
              key={func.id}
              className="flex-col items-center gap-4 text-secondary w-[80%]"
            >
              {LOCAL_ICON_MAPPING[func.name]("large")}
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  {func.title}
                </h3>
                <p className="text-sm text-gray-400">{func.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center items-center max765:w-full w-[50%]">
        <DynamicForm
          title="Redefinir senha"
          subtitle="Redefina sua senha para acessar sua conta."
          schema={resetPasswordSchema}
          button_text="Confirmar nova senha"
          onSubmit={handleResetPassword}
          isLoading={isLoading}
          fields={[
            {
              name: "new_password",
              label: "Nova senha",
              type: "password",
              required: true,
              error: errors.new_password?.message as string,
            },
            {
              name: "password_confirmation",
              label: "Confirme a nova senha",
              type: "password",
              required: true,
              error: errors.password_confirmation?.message as string,
            },
          ]}
          back_login_text="Cancelar solicitação"
          have_account_text="Deseja voltar?"
          server_error={serverError}
        />
      </div>
    </div>
  );
}
