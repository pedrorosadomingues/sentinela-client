"use client";

import { logout } from "@/utils";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function Header(): JSX.Element {
  const router = useRouter();
  const locale = useLocale();
  const text = useTranslations("header");
  const user_name = localStorage.getItem("user_name");

  function handleLogout(): void {
    logout();
    router.push(`/${locale}/sign-in`);
  }

  return (
    <header className="flex items-center justify-between p-4 bg-[#FFFFFF] text-white fixed w-full border-b border-gray-200 pl-[80px]">
      <div>
        <h1 className="text-2xl text-black">{text("greeting")}, {user_name}</h1>
        <p className="text-black">{text("prompt")}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="hover:cursor-pointer text-black"
          onClick={handleLogout}
        >
          {text("logout")}
        </button>
      </div>
    </header>
  );
}
