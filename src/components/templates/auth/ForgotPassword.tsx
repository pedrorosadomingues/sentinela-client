"use client";

import React, { useState } from "react";
import { Button, Input, Link, Form } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { useRootStore } from "@/stores";
import { useToast } from "@/hooks/useToast";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestResetPassword } from "@/services";
import { useRouter } from "next/navigation";

export function ForgotPassword() {
  const t = useTranslations("forgot_password_page");
  const toast = useToast();
  const router = useRouter();
  const locale = useLocale();
  const { setEmailSended, setRootControl } = useRootStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const forgot_schema = z.object({
    email: z.string().email(t("invalid_email")),
  });

  type ForgotPasswordFormValues = z.infer<typeof forgot_schema>;

  const {
    formState: { errors },
    setError,
    handleSubmit,
    register,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgot_schema),
  });

  const onSubmitForgotPassword: SubmitHandler<
    ForgotPasswordFormValues
  > = async (values) => {
    setIsLoading(true);

    const response = await requestResetPassword({ ...values, locale });

    if (response.status === 200) {
      setRootControl("success-email-sended");
      setEmailSended("forgot-password");

      return router.refresh(); // 🔄 Atualiza os dados da sessão
    }

    let error: null | string = null;

    if (response.status === 400) {
      error = t("email_not_found");
      setError("root", { message: t("email_not_found") });
    } else {
      toast.use("error", t("unexpected_error"));
    }

    if (error) {
      toast.use("error", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 p-4">
      <div className="w-full text-left">
        <p className="pb-2 text-xl font-medium">{t('forgot_password')}</p>
        <p className="text-small text-default-500">
          {t('description')}
        </p>
      </div>

      <Form
        className="flex w-full flex-col gap-3"
        validationBehavior="native"
        onSubmit={handleSubmit(onSubmitForgotPassword)}
      >
        <Input
          isRequired
          label={t("email")}
          placeholder={t("email_placeholder")}
          type="email"
          variant="bordered"
          {...register("email")}
          isDisabled={isLoading}
        />

        <Button
          className="w-full mt-4"
          color="secondary"
          type="submit"
          isLoading={isLoading}
        >
          {t("send")}
        </Button>

        <span className="text-sm text-danger">{errors.root?.message}</span>
      </Form>
      <p className="text-center text-small">
        {t('back_to')}{" "}
        <Link
          href="#"
          size="sm"
          onPress={() => setRootControl("login")}
          isDisabled={isLoading}
        >
          {t('login')}
        </Link>
      </p>
    </div>
  );
}
