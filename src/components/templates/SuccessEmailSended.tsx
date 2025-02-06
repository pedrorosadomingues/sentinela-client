"use client";

import RootBanner from "../organisms/RootBanner";
import { useTranslations } from "next-intl";


export default function ForgotPassword() {
  const text = useTranslations("sign_up_page");

  return (
    <div className="min-h-screen w-screen flex items-center">
       <p>{text("forgot_password")}</p>
      <div className="rounded-l-[60px] bg-primary-background h-screen w-[50%] flex items-center justify-center max515:hidden">
        <RootBanner />
      </div>
    </div>
  );
}
