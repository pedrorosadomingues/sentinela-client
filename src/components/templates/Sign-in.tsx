/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { login } from "@/services";
import { toast } from "react-toastify";
import PasswordVisibilityToggle from "../atoms/PasswordVisibilityToggle";

export default function LoginTemplate(): JSX.Element {
  const locale = useLocale();
  const text = useTranslations("sign_in_page");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async () => {
      setIsLoading(true);
      try {
        const response = await login({
          email: formik.values.email,
          password: formik.values.password,
        });

        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          window.location.href = `/${locale}/home`;
        } else {
          toast.error(text("invalid_email_or_password"));
        }
      } catch (error) {
        console.log("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="bg-primary min-h-screen min-w-[40%] max-w-lg flex justify-center items-center flex-col">
      <Image
        src={"/img/logo-vestiq.png"}
        alt="Vestiq logo"
        width={150}
        height={250}
        priority={true}
      />
      <div className="mt-10 p-10 rounded-xl bg-slate-100 w-full max-w-md">
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div className="mb-5">
            <TextField
              label={text("email")}
              variant="outlined"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-full"
              type="email"
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </div>
          <div className="mb-5">
            <TextField
              label={text("password")}
              variant="outlined"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              className="w-full"
              type={showPassword ? "text" : "password"}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <PasswordVisibilityToggle
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />
                  ),
                },
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </div>
          <div className="ml-auto mb-5">
            <Button type="submit" variant="contained" disabled={isLoading}>
              {text("login")}
            </Button>
          </div>
        </form>
        <a
          className="flex justify-center mt-5 text-sm"
          href={`/${locale}/sign-up`}
        >
          {text("dont_have_account")} {text("sign_up_here")}
        </a>
        <a className="flex justify-center mt-5 text-sm" href="/">
          {text("forgot_password")}
        </a>
      </div>
    </div>
  );
}
