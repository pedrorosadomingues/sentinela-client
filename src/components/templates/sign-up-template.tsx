/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import login from "@/services/auth/login";
// import en from "../../public/locales/en/login.json";
// import ptBR from "../../public/locales/pt-br/login.json";

export default function SignUpTemplate() {
  // const locale = router.locale;
  // const t = locale === "pt-br" ? ptBR : en;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async () => {
      setIsLoading(true);
      try {
        const response = await login(
          formik.values.email,
          formik.values.password
        );

        if (response.status === 200) {
          window.location.href = "/";
        } else {
          alert(
            "Erro ao fazer login:" + JSON.stringify(response.message.error)
          );
        }
      } catch (error) {
        console.log("Erro inesperado:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });
  return (
    <div className="bg-primary min-h-screen min-w-[40%] max-w-lg flex justify-center items-center flex-col">
      <Image
        src={"/img/logo.png"}
        alt="Redraw logo"
        width={150}
        height={250}
        priority={true}
      />
      <div className="mt-10 p-10 rounded-xl bg-slate-100 w-full max-w-md">
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div className="mb-5">
            <TextField
              label="Name"
              variant="filled"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-full"
              type="email"
              required
            />
          </div>
          <div className="mb-5">
            <TextField
              label="Email"
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
              label="Password"
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
              Register
            </Button>
          </div>
        </form>
        <a
        className="flex justify-center mt-5 text-sm" 
        href="/pages/login"> Back to login </a>
      </div>
    </div>
  );
}
