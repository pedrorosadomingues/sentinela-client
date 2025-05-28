/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import {signUp} from "@/services/user/sign-up";
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
          alert("User created successfully");
          window.location.href = "/";
        } else {
          alert(
            "Error creating user:" + JSON.stringify(response.message?.error)
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
        style={{ objectFit: "contain", borderRadius: "50%" }}
      />
      <div className="mt-10 p-10 rounded-xl bg-slate-100 w-full max-w-md">
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div className="mb-5">
            <TextField
              label="Name"
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
              Registrar
            </Button>
          </div>
        </form>
        <a className="flex justify-center mt-5 text-sm" href="/pages/sign-in">
          {" "}
          Voltar para login{" "}
        </a>
      </div>
    </div>
  );
}
