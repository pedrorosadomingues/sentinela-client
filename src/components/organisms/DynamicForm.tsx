"use client";

import { useForm, SubmitHandler, FieldValues, Path } from "react-hook-form";
import { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField, Alert } from "@mui/material";
import Image from "next/image";
import { useRootStore } from "@/zustand-stores";
import LanguageSwitcher from "./RootLanguageSwitcher";

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  error: string;
}

interface AuthFormProps<T extends FieldValues> {
  title: string;
  fields: Field[];
  schema: ZodSchema<T>;
  button_text: string;
  onSubmit: SubmitHandler<T>;
  isLoading: boolean;
  server_error?: Record<string, string> | null;
  subtitle?: string;
  forgot_password_link?: string;
  signup_text?: string;
  no_account_text?: string;
  have_account_text?: string;
  back_login_text?: string;
}

export default function AuthForm<T extends FieldValues>({
  title,
  fields,
  schema,
  button_text,
  onSubmit,
  isLoading,
  server_error,
  subtitle,
  forgot_password_link,
  no_account_text,
  signup_text,
  have_account_text,
  back_login_text,
}: AuthFormProps<T>) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
  });

  const { setRootControl } = useRootStore();

  return (
    <div className="p-2 w-[80%] h-screen flex flex-col justify-center items-center max-w-[576px] m-auto">
      <div className="fixed top-0 right-0 z-[1000] lg:hidden">
        <LanguageSwitcher />
      </div>
      <div className="w-[100%] flex flex-col justify-between ">
        <Image
          src="/images/logo-vestiq.png"
          alt="Vestiq logo"
          width={150}
          height={250}
          priority
          className="mb-[20px]"
        />

        <p className="text-[30px] font-bold">{title}</p>
        {subtitle && (
          <p className="text-gray-500 text-sm">{subtitle}</p>
        )}

        {server_error && server_error.general && (
          <Alert severity="error" className="mt-4">
            {server_error.general}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-4">
          {fields.map((field) => (
            <div key={field.name} className="mt-5">
              <TextField
                label={field.label}
                variant="outlined"
                type={field.type}
                {...register(field.name as Path<T>)}
                className="w-full"
                error={!!errors[field.name] || !!server_error?.[field.name]}
                helperText={
                  (errors[field.name]?.message as unknown as string) ||
                  server_error?.[field.name]
                }
              />
            </div>
          ))}
          {forgot_password_link && (
            <a
              onClick={() => setRootControl("forgot-password")}
              className="hover:underline hover:cursor-pointer font-medium text-right text-secondary mb-5"
            >
              {forgot_password_link}
            </a>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            className="bg-primary-background text-white"
            style={{ marginTop: "25px" }}
          >
            {isLoading ? "Enviando..." : button_text}
          </Button>

          {no_account_text && (
            <p className="flex justify-center text-sm mt-[25px]">
              {no_account_text}{" "}
              <a
                onClick={() => setRootControl("register")}
                className="text-secondary ml-[4px] font-medium hover:underline hover:cursor-pointer"
              >
                {signup_text}
              </a>
            </p>
          )}

          {have_account_text && (
            <p className="flex justify-center text-sm mt-[25px]">
              {have_account_text}{" "}
              <a
                onClick={() => setRootControl("login")}
                className="text-secondary ml-[4px] font-medium hover:underline hover:cursor-pointer"
              >
                {back_login_text}
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
