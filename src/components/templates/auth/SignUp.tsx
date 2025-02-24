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
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/useToast";
import { signUp } from "@/services";

export function SignUp() {
  const t = useTranslations("sign_up_page");
  const toast = useToast();
  const locale = useLocale();
  const { setRootControl, setEmailSended } = useRootStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const signup_schema = z.object({
    name: z.string().min(3, t("name_min_length")),
    email: z.string().email(t("invalid_email")),
    password: z.string().min(6, t("password_min_length")),
    confirm_password: z.string().min(6, t("password_min_length")),
  });

  type SignUpFormValues = z.infer<typeof signup_schema>;

  const {
    formState: { errors },
    setError,
    handleSubmit,
    register,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signup_schema),
  });

  const onSubmitSignUp: SubmitHandler<SignUpFormValues> = async (values) => {
    setIsLoading(true);

    if (values.password !== values.confirm_password) {
      setError("root", { message: t("passwords_dont_match") });

      return;
    }

    const response = await signUp({ ...values, locale });

    if (response.status === 200) {
      // return router.refresh(); // 🔄 Atualiza os dados da sessão
      setRootControl("success-email-sended");
      setEmailSended("register");
    }

    let error: null | string = null;

    if (response.message?.name === "UserNotVerifiedError") {
      error = t("user_not_verified");
      setError("root", { message: t("user_not_verified") });
    } else if (response.status === 409) {
      setError("root", { message: t("email_already_registered") });
    } else if (response?.status === 500) {
      toast.use("error", "Erro inesperado ao fazer login.");
    }

    if (error) {
      toast.use("error", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 p-4">
      <div className="w-full text-left">
        <p className="pb-2 text-xl font-medium">Sign Up</p>
        <p className="text-small text-default-500">
          Create an account to continue
        </p>
      </div>

      <Form
        className="flex w-full flex-col gap-3"
        validationBehavior="native"
        onSubmit={handleSubmit(onSubmitSignUp)}
      >
        <Input
          isRequired
          label="Name and Surname"
          placeholder="Enter your name"
          type="text"
          variant="bordered"
          {...register("name")}
          isDisabled={isLoading}
        />
        <Input
          isRequired
          label="Email Address"
          placeholder="Enter your email"
          type="email"
          variant="bordered"
          {...register("email")}
          isDisabled={isLoading}
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
          label="Password"
          placeholder="Enter your password"
          type={isVisible ? "text" : "password"}
          variant="bordered"
          {...register("password")}
          isDisabled={isLoading}
        />
        <Input
          isRequired
          endContent={
            <button type="button" onClick={toggleConfirmVisibility}>
              {isConfirmVisible ? (
                <VisibilityOffOutlined className="pointer-events-none text-2xl text-default-400" />
              ) : (
                <VisibilityOutlined className="pointer-events-none text-2xl text-default-400" />
              )}
            </button>
          }
          label="Confirm Password"
          placeholder="Confirm your password"
          type={isConfirmVisible ? "text" : "password"}
          variant="bordered"
          {...register("confirm_password")}
          isDisabled={isLoading}
        />
        <Checkbox isRequired className="py-4" size="sm" isDisabled={isLoading}>
          I agree with the&nbsp;
          <Link href="#" size="sm" isDisabled={isLoading}>
            Terms
          </Link>
          &nbsp; and&nbsp;
          <Link href="#" size="sm" isDisabled={isLoading}>
            Privacy Policy
          </Link>
        </Checkbox>
        <Button
          className="w-full"
          color="secondary"
          type="submit"
          isLoading={isLoading}
        >
          Sign Up
        </Button>

        <span className="text-sm text-danger">{errors.root?.message}</span>
      </Form>

      <div className="flex w-full items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="shrink-0 text-tiny text-default-500">OR</p>
        <Divider className="flex-1" />
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
      <p className="text-center text-small">
        Already have an account?&nbsp;
        <Link
          href="#"
          size="sm"
          onPress={() => setRootControl("login")}
          isDisabled={isLoading}
        >
          Log In
        </Link>
      </p>
    </div>
  );
}
