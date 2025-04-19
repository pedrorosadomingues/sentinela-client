/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Checkbox, Link, Divider, Form } from "@heroui/react";
import {
  Facebook,
  Google,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useGlobalStore, useUserStore } from "@/stores";
import { useToast } from "@/hooks/useToast";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/services";
import { useRouter } from "next/navigation";
import VestiqLogo from "@/components/atoms/VestiqLogo";

export function SignIn() {
  const t = useTranslations("sign_in_page");
  const toast = useToast();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { setRootControl } = useGlobalStore();
  const { getUser } = useUserStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAwaitingRedirect, setIsAwaitingRedirect] = useState<boolean>(false);

  const login_schema = z.object({
    email: z.string().email(t("invalid_email")),
    password: z.string().min(6, t("password_min_length")),
  });

  type LoginFormValues = z.infer<typeof login_schema>;

  const {
    formState: { errors },
    setError,
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(login_schema),
  });

  const onSubmitLogin: SubmitHandler<LoginFormValues> = async (values) => {
    setIsLoading(true);
    setIsAwaitingRedirect(false);

    const response = await login(values);
    let error: null | string = null;

    if (response.status === 200) {
      setIsAwaitingRedirect(true);

      await getUser(response.data.user.id);

      // 🔹 Atualiza a página e redireciona para a rota privada correta
      router.push(`/main`);
      router.refresh(); // 🔄 Atualiza os dados da sessão

      return;
    } else if (response.message?.name === "UserNotVerifiedError") {
      error = t("user_not_verified");
      setError("root", { message: t("user_not_verified") });
    } else if (response.message?.name === "InvalidCredentialsError") {
      error = t("invalid_email_or_password");
      setError("root", { message: t("invalid_email_or_password") });
    } else if (response.status === 401) {
      error = t("invalid_email_or_password");
      setError("root", { message: t("invalid_email_or_password") });
    } else {
      toast.use("error", t("unexpected_error"));
    }

    if (error) {
      toast.use("error", error);
      setIsLoading(false);
      setIsAwaitingRedirect(false);
    }
  };

  return (
    <div className="flex w-[60%] flex-col items-center gap-4 p-4">
      <div className="w-full items-start justify-start">
        <VestiqLogo className="w-50" />
      </div>
      <div className="w-full text-left">
        <p className="pb-2 text-xl font-medium">{t("sign_in")}</p>
        <p className="text-small text-default-500">{t("sign_in_message")}</p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Button
          startContent={<Google width={24} />}
          variant="bordered"
          isDisabled
        >
          {t("continue_with")} Google
        </Button>
        <Button
          startContent={<Facebook className="text-default-500" width={24} />}
          variant="bordered"
          isDisabled
        >
          {t("continue_with")} Facebook
        </Button>
      </div>

      <div className="flex w-full items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="shrink-0 text-tiny text-default-500">{t("or")}</p>
        <Divider className="flex-1" />
      </div>

      <Form
        className="flex w-full flex-col gap-3"
        validationBehavior="native"
        onSubmit={handleSubmit(onSubmitLogin)}
      >
        <Input
          isRequired
          label={t("email")}
          placeholder={t("email_placeholder")}
          type="email"
          variant="bordered"
          isDisabled={isLoading || isAwaitingRedirect}
          {...register("email")}
        />
        <Input
          isRequired
          endContent={
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? (
                <VisibilityOffOutlined className="pointer-events-none text-2xl text-default-400" />
              ) : (
                <VisibilityOutlined className="pointer-events-none text-2xl text-default-400" />
              )}
            </button>
          }
          label={t("password")}
          placeholder={t("password_placeholder")}
          type={isVisible ? "text" : "password"}
          variant="bordered"
          isDisabled={isLoading || isAwaitingRedirect}
          {...register("password")}
        />
        <div className="flex w-full items-center justify-between px-1 py-2">
          <Checkbox
            name="remember"
            size="sm"
            isDisabled={isLoading || isAwaitingRedirect}
          >
            {t("remember_me")}
          </Checkbox>
          <Link
            href="#"
            size="sm"
            onPress={() => setRootControl("forgot-password")}
            isDisabled={isLoading || isAwaitingRedirect}
          >
            {t("forgot_password")}
          </Link>
        </div>
        <Button
          className="w-full"
          color="secondary"
          type="submit"
          isLoading={isLoading}
        >
          {t("sign_in_label")}
        </Button>

        <span className="text-sm text-danger">{errors.root?.message}</span>
      </Form>

      <p className="text-center text-small">
        {t("dont_have_account")}&nbsp;
        <Link
          href="#"
          size="sm"
          onPress={() => setRootControl("register")}
          isDisabled={isLoading || isAwaitingRedirect}
        >
          {t("sign_up_here")}
        </Link>
      </p>
    </div>
  );
}
