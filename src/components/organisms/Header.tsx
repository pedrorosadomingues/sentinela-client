/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { logout } from "@/utils";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useUserStore, useMainStore } from "@/zustand-stores";
import LanguageSwitcher from "./MainLanguageSwitcher";
import { Divider } from "@nextui-org/react";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

export default function Header(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const text = useTranslations("header");
  const { user, getUser, setUser } = useUserStore();
  const { mainControl, setMainControl } = useMainStore();

  const [tab, setTab] = useState<string | null>(null);
  const [isOpenMenuPerfil, setIsOpenMenuPerfil] = useState(false);

  function handleLogout(): void {
    logout();
    router.push(`/${locale}`);
    setUser(null);
  }

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");

    if (storedUserId && storedUserId !== "null") {
      getUser({ user_id: storedUserId });
    } else {
      alert("Please login again");
      redirect(`/${locale}`);
    }

    const currentTab = searchParams.get("tab");
    if (currentTab) {
      setMainControl(currentTab);
      setTab(currentTab);
    }
  }, [getUser, searchParams, setMainControl, router, locale]);

  function renderHeaderContent() {
    const current = mainControl || tab;

    switch (current) {
      case "Home":
      case "Início":
      case "Inicio":
        return (
          <div>
            <h1 className="text-2xl text-black">
              {text("greeting")} {user && "name" in user ? user.name : ""}
            </h1>
            <p className="text-black">{text("prompt")}</p>
          </div>
        );

      case "My Generations":
      case "Minhas Gerações":
      case "Mis generaciones":
        return (
          <h1 className="text-2xl text-black">{text("my_generations")}</h1>
        );

      case "Vestir Modelo":
      case "Dress Model":
        return <h1 className="text-2xl text-black">{text("dress-model")}</h1>;

      case "Imagem a partir de Texto":
      case "Image from Text":
      case "Imagen a partir de Texto":
        return <h1 className="text-2xl text-black">{text("txt2img")}</h1>;

      case "Renderizar Traços":
      case "Render Traces":
      case "Renderizar Trazos":
        return <h1 className="text-2xl text-black">{text("render-traces")}</h1>;

      default:
        return <h1 className="text-2xl text-black">{mainControl}</h1>;
    }
  }

  return (
    <header className="flex z-[1000] items-center justify-between p-4 bg-[#FFFFFF] text-white fixed w-full border-b border-gray-200 pl-[90px] bg-white">
      {renderHeaderContent()}

      <button
        className="border-0 text-2xl cursor-pointer text-[#F10641]"
        onClick={() => setIsOpenMenuPerfil((prev) => !prev)}
      >
        <PermIdentityIcon />
      </button>
      {isOpenMenuPerfil && (
        <div className="absolute flex flex-col bg-white right-[57px] top-[42px] p-4 z-[1000] rounded box-border border border-gray-200 shadow-md rounded-md">
          <button className="hover:cursor-pointer text-black z-[1000] mb-[5px]">
            Meu Perfil
          </button>
          <Divider />
          <LanguageSwitcher />
          <Divider />
          <button
            className="hover:cursor-pointer text-black bg-white mt-[5px]"
            onClick={handleLogout}
          >
            {text("logout")}
          </button>
        </div>
      )}
    </header>
  );
}
