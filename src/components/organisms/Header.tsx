"use client";

import { logout } from "@/utils";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import {
  useUserStore,
  useMainStore,
  useImageFunctionStore,
} from "@/zustand-stores";

export default function Header(): JSX.Element {
  const router = useRouter();
  const locale = useLocale();
  const text = useTranslations("header");
  const { user, getUser } = useUserStore();
  const { mainControl } = useMainStore();
  const { imageFunctionName } = useImageFunctionStore();

  function handleLogout(): void {
    logout();
    router.push(`/${locale}`);
  }

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      getUser({ user_id: storedUserId });
    }
  }, [getUser]);
  return (
    <header className="flex items-center justify-between p-4 bg-[#FFFFFF] text-white fixed w-full border-b border-gray-200 pl-[90px]">
      {mainControl === "Home" ||
      mainControl === "Início" ||
      mainControl === "Inicio" ? (
        <div>
          <h1 className="text-2xl text-black ">
            {text("greeting")}, {user?.name}
          </h1>
          <p className="text-black">{text("prompt")}</p>
        </div>
      ) : mainControl === "My Generations" ||
        mainControl === "Minhas Gerações" ||
        mainControl === "Mis generaciones" ? (
        <h1 className="text-2xl text-black">{text("my_generations")}</h1>
      ) : (
        <h1 className="text-2xl text-black">{text(imageFunctionName)}</h1>
      )}
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
