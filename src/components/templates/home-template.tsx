/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { useFormik } from "formik";
import { Button, FilledInput, TextField } from "@mui/material";
import { useState } from "react";
import signUp from "@/services/user/sign-up";
// import en from "../../public/locales/en/login.json";
// import ptBR from "../../public/locales/pt-br/login.json";

export default function HomeTemplate() {
  // const locale = router.locale;
  // const t = locale === "pt-br" ? ptBR : en;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      category: "",
      model_image: "",
      garment_image: "",
    },
    onSubmit: async () => {
      console.log("form data", formik.values);
      //   setIsLoading(true);
      //   try {
      //     const response = await signUp({
      //       name: formik.values.name,
      //       email: formik.values.email,
      //       password: formik.values.password,
      //     });

      //     if (response.status === 200) {
      //       alert("User created successfully");
      //       window.location.href = "/";
      //     } else {
      //       alert(
      //         "Error creating user:" + JSON.stringify(response.message?.error)
      //       );
      //     }
      //   } catch (error) {
      //     console.log("Erro inesperado:", error);
      //   } finally {
      //     setIsLoading(false);
      //   }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const files = event.target.files;
    if (files) {
      const file = files[0]; // Pega o primeiro arquivo selecionado
      formik.setFieldValue(name, file); // Define o valor no formik
    }
    formik.setFieldValue(name, files); // Define o valor no formik
  };

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
            <input
              type="file"
              name="model_image"
              onChange={handleFileChange}
              accept="image/*" // Para garantir que somente imagens sejam selecionadas
            />
          </div>
          <div className="mb-5">
            <input
              type="file"
              name="garment_image"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <div className="mb-5">
            <TextField
              label="Category"
              variant="filled"
              name="category"
              onChange={formik.handleChange}
              value={formik.values.category}
              className="w-full"
              type="text"
              required
            />
          </div>
          <div className="ml-auto mb-5">
            <Button type="submit" variant="contained" disabled={isLoading}>
              Register
            </Button>
          </div>
        </form>
        <a className="flex justify-center mt-5 text-sm" href="/pages/sign-in">
          {" "}
          Back to login{" "}
        </a>
      </div>
    </div>
  );
}
