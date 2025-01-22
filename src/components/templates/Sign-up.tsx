"use client";
import Image from "next/image";
import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { signUp } from "@/services/user/sign-up";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useRootStore } from "@/zustand-stores/rootStore";
import { login, createCoinReceiptService } from "@/services";
import RootBanner from "@/components/organisms/RootBanner";
import { FIRST_ACCESSS_TYPE_ID, FIRST_ACCESS_COINS } from "@/constants";

export default function SignUpTemplate(): JSX.Element {
  const locale = useLocale();
  const text = useTranslations("sign_up_page");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setRootControl } = useRootStore();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async () => {
      setIsLoading(true);
      try {
        const responseSignUp = await signUp({
          name: formik.values.name,
          email: formik.values.email,
          password: formik.values.password,
        });

        if (responseSignUp.status === 200) {
          toast.success(text("user_created_successfully"));
          const responseLogin = await login({
            email: formik.values.email,
            password: formik.values.password,
          });

          if (responseLogin.status === 200) {
            localStorage.setItem("token", responseLogin.data.token);
            localStorage.setItem("user_id", responseLogin.data.user.id);
            localStorage.setItem("user_name", responseLogin.data.user.name);
            await createCoinReceiptService({
              v_coins: FIRST_ACCESS_COINS,
              type_id: FIRST_ACCESSS_TYPE_ID,
              user_email: responseLogin.data.user.email,
            });
            window.location.href = `/${locale}/main`;
          }
        } else {
          toast.error(
            text("error_creating_user") +
              " " +
              JSON.stringify(responseSignUp.message?.error)
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
      <div className="p-10 w-[50%] h-screen items-center flex-col flex justify-center  max1030:w-full max1030:p-0 max1030:pb-[150px] max1030:max-w-[576px] max1030:m-auto">
        <div className="w-[65%] h-[100%] flex-col justify-center flex gap-[25px] max1030:w-[85%] max1030:mt-[90px]">
          <Image
            src={"/images/logo-vestiq.png"}
            alt="Vestiq logo"
            width={150}
            height={250}
            priority={true}
          />
          <p className="text-[30px] font-bold">{text("sign_up")}</p>
          <form onSubmit={formik.handleSubmit} className="flex flex-col">
            <div className="mb-5">
              <TextField
                label={text("name")}
                variant="outlined"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                className="w-full"
                type="text"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                required
              />
            </div>
            <div className="mb-5">
              <TextField
                label={text("email")}
                variant="outlined"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full"
                type="email"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                required
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
                type="password"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                required
              />
            </div>
            {/* <div className="mb-5">
              <TextField
                label={text("confirm_password")}
                variant="outlined"
                name="confirm_password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className="w-full"
                type="password"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                required
              />
            </div> */}
            <div className="ml-auto mb-5 w-full">
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
               className="bg-primary-background h-[48px] !rounded-[0.5rem]"
              >
                {text("register")}
              </Button>
            </div>
          </form>
          <p
            className="flex justify-center mt-5 text-sm ml-auto mr-auto"
            onClick={() => setRootControl("login")}
          >
            <p>
              {text("have_account")}{" "}
              <span className="hover:cursor-pointer text-[#F83A14] hover:underline hover:text-[#F83A14] font-medium">
                {text("back_to_login")}
              </span>
            </p>
          </p>
        </div>
      </div>
      <div className="rounded-l-[60px] bg-primary-background h-screen w-[50%] flex items-center justify-center max515:hidden ">
        <RootBanner />
      </div>
    </div>
  );
}
