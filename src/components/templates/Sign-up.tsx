"use client";
import Image from "next/image";
import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { signUp } from "@/services/user/sign-up";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-toastify";

export default function SignUpTemplate(): JSX.Element {
  const locale = useLocale();
  const text = useTranslations("sign_up_page");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async () => {
      setIsLoading(true);
      try {
        const response = await signUp({
          name: formik.values.name,
          email: formik.values.email,
          password: formik.values.password,
        });

        if (response.status === 200) {
          toast.success(text("user_created_successfully"));
          window.location.href = "/";
        } else {
          toast.error(
            text("error_creating_user") +
              " " +
              JSON.stringify(response.message?.error)
          );
        }
      } catch (error) {
        console.log("Unexpected error:", error);
        toast.error(text("unexpected_error"));
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
                style={{ paddingTop: "10px" }}
                label={text("name")}
                variant="filled"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                className="w-full"
                type="text"
                required
              />
            </div>
            <div className="mb-5">
              <TextField
                style={{ paddingTop: "10px" }}
                label={text("email")}
                variant="filled"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full"
                type="email"
                required
              />
            </div>
            <div className="mb-5">
              <TextField
                style={{ paddingTop: "10px" }}
                label={text("password")}
                variant="filled"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className="w-full"
                type="password"
                required
              />
            </div>
            <div className="ml-auto mb-5">
              <Button type="submit" variant="contained" disabled={isLoading}>
                {text("register")}
              </Button>
            </div>
          </form>
          <a
            className="flex justify-center mt-5 text-sm"
            href={`/${locale}/sign-in`}
          >
            {text("back_to_login")}
          </a>
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
