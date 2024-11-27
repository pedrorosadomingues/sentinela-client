/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useFormik } from "formik";
import { Button, colors, TextField } from "@mui/material";
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
          localStorage.setItem("user_id", response.data.user.id);
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
    <div className="min-h-screen w-screen flex items-center">
      <div className="p-10 w-[50%] h-screen items-center flex-col flex justify-center">
        <div className="w-[65%] h-[450px] flex-col justify-between flex">
          <Image
            src={"/img/logo-vestiq.png"}
            alt="Vestiq logo"
            width={150}
            height={250}
            priority={true}
          />
          <p className="text-[30px] font-bold">{text("login")}</p>
          <p className="text-gray-500 text-sm mb-[35px]">
            Access your account now to use the best in AI for your projects. If
            you don't already have an account, subscribe to Vestiq now to
            enhance your projects.
          </p>
          <form onSubmit={formik.handleSubmit} className="flex flex-col">
            <div className="mb-5">
              <TextField
                label={text("email")}
                variant="outlined"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full "
                type="email"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </div>
            <div className="">
              <TextField
                label={text("password")}
                variant="outlined"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className="w-full"
                type={showPassword ? "text" : "password"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white", // Fundo branco no input
                    borderRadius: "4px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D1D5DB",              
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "black",
                  },
                }}
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
            <div className="ml-auto w-full">
              <div className="flex justify-end mt-[10px] text-sm text-[#F83A14] mb-[25px] ">
                <a href="/" className="hover:underline font-medium">
                  {text("forgot_password")}
                </a>
              </div>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
                className="bg-primary-background"
              >
                {text("login") + ">>"}
              </Button>
            </div>
          </form>
          <p className="flex justify-center text-sm mt-[25px]">
            {text("dont_have_account")}{" "}
            <a
              href={`/${locale}/sign-up`}
              className="text-[#F83A14] ml-[4px] font-medium hover:underline"
            >
              {text("sign_up_here")}
            </a>
          </p>
        </div>
      </div>
      <div className="rounded-l-[60px] bg-primary-background h-screen w-[50%] flex items-center justify-center">
        <p className="text-white mt-5 text-sm">
          {text("powered_by")} <strong>Vestiq</strong>
        </p>
      </div>
    </div>
  );
}
