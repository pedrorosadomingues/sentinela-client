"use client";
import Image from "next/image";
import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
// import { useRouter } from "next/router";
// import en from "../../public/locales/en/login.json";
// import ptBR from "../../public/locales/pt-br/login.json";

const Login = () => {
  // const router = useRouter();
  // const [error, setError] = useState<string>("");
  // const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const locale = router.locale;
  // const t = locale === "pt-br" ? ptBR : en;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: () => {
      setIsLoading(true);
    },
  });

  // const resetPassword = () => {
  //   setIsLoading(true);

  //   const email = formik.values.email;

  //   if (!email) {
  //     setTimeout(() => setError(""), 5000);
  //     return setError(t.error3);
  //   }

  //   if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
  //     setTimeout(() => setError(""), 5000);
  //     return setError(t.error4);
  //   }

  //   setError("");
  //   setSuccess(t.success);
  //   setTimeout(() => setSuccess(""), 10000);

  //   supabaseClient.auth.resetPasswordForEmail(email, {
  //     redirectTo: `${
  //       location.protocol + "//" + location.host
  //     }/member/reset-password`,
  //   });

  //   setTimeout(() => setIsLoading(false), 1000);
  // };

  return (
    <div className="w-full flex bg-primary items-center justify-center">
      <a
      href="/"
      >
        voltar
      </a>
      <div className="bg-primary min-h-screen min-w-[40%] max-w-lg flex justify-center items-center flex-col">
        <Image
          src={"/img/logo.png"}
          alt="Redraw logo"
          width={150}
          height={250}
        />
        <div className="mt-10 p-10 rounded-xl bg-slate-100 w-full max-w-md">
          <form onSubmit={formik.handleSubmit} className="flex flex-col">
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
                label="Senha"
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
                Entrar
              </Button>
              {/* </div>
            {/* {error && (
              <div className="w-full mb-5">
                <Alert severity="error">{error}</Alert>
              </div>
            )}
            {success && (
              <div className="w-full mb-5">
                <Alert severity="success">{success}</Alert>
              </div>
            )} */}
              {/* <div className="text-center"> */}
              {/* <Button size="small" onClick={resetPassword}>
                {t.btn2}
              </Button> */}
             
            </div>
          </form>
          <a  className="flex justify-center"
          href="/sign-up">Nao tem conta? Cadastre-se</a>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
