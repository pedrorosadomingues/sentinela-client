"use client";
import Image from "next/image";
import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { signUp } from "@/services/user/sign-up";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useRootStore } from "@/zustand-stores/rootStore";
import RootBanner from "@/components/organisms/RootBanner";

export default function SignUpTemplate(): JSX.Element {
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
        <div className="w-[65%] h-[100%] flex-col justify-center flex gap-[25px]">
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
                label={text("last_name")}
                variant="outlined"
                name="lastname"
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
            <div className="mb-5">
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
            </div>
            <div className="ml-auto mb-5 w-full">
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
                className="bg-primary-background"
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
      <div className="rounded-l-[60px] bg-primary-background h-screen w-[50%] flex items-center justify-center">
        <RootBanner />
      </div>
    </div>
  );
}
