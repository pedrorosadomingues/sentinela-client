"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Checkbox,
  Link,
  Divider,
  Form,
} from "@heroui/react";
import {
  Facebook,
  Google,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useLocale, useTranslations } from "next-intl";
import { useRootStore } from "@/stores";
import { useToast } from "@/hooks/useToast";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/services";
import { useRouter } from "next/navigation";

export function SignIn() {
  const t = useTranslations("sign_in_page");
  const toast = useToast();
  const router = useRouter();
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { setRootControl } = useRootStore();

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
  
    if (response.status === 200) {
      setIsAwaitingRedirect(true);
  
      // 🔹 Atualiza a página e redireciona para a rota privada correta
      router.push(`/${locale}/main`);
      return router.refresh(); // 🔄 Atualiza os dados da sessão
    }
  
    let error: null | string = null;
  
    if (response.message?.name === "UserNotVerifiedError") {
      error = t("user_not_verified");
      setError("root", { message: t("user_not_verified") });
    } else if (response.message?.name === "InvalidCredentialsError") {
      error = t("invalid_email_or_password");
      setError("root", { message: t("invalid_email_or_password") });
    } else if (response.status === 401) {
      error = t("invalid_email_or_password");
      setError("root", { message: t("invalid_email_or_password") });
    } else {
      toast.use("error", "Erro inesperado ao fazer login.");
    }
  
    if (error) {
      toast.use("error", error);
    }
  
    setIsLoading(false);
    setIsAwaitingRedirect(false);
  };
  
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 p-4">
      <div className="w-full text-left">
        <p className="pb-2 text-xl font-medium">Welcome Back</p>
        <p className="text-small text-default-500">
          Log in to your account to continue
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Button
          startContent={<Google width={24} />}
          variant="bordered"
          isDisabled
        >
          Continue with Google
        </Button>
        <Button
          startContent={<Facebook className="text-default-500" width={24} />}
          variant="bordered"
          isDisabled
        >
          Continue with Facebook
        </Button>
      </div>

      <div className="flex w-full items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="shrink-0 text-tiny text-default-500">OR</p>
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
            Remember for 15 days
          </Checkbox>
          <Link
            href="#"
            size="sm"
            onPress={() => setRootControl("forgot-password")}
            isDisabled={isLoading || isAwaitingRedirect}
          >
            Forgot password?
          </Link>
        </div>
        <Button
          className="w-full"
          color="secondary"
          type="submit"
          isLoading={isLoading}
        >
          Log In
        </Button>

        <span className="text-sm text-danger">{errors.root?.message}</span>
      </Form>

      <p className="text-center text-small">
        Need to create an account?&nbsp;
        <Link
          href="#"
          size="sm"
          onPress={() => setRootControl("register")}
          isDisabled={isLoading || isAwaitingRedirect}
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
