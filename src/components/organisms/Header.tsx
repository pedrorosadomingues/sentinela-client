/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { logout } from "@/utils";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useUserStore, useMainStore } from "@/zustand-stores";
import LanguageSwitcher from "./MainLanguageSwitcher";
import { Divider } from "@nextui-org/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
    const stored_user_id = localStorage.getItem("user_id");
    const local_user = stored_user_id
      ? getUser({ user_id: stored_user_id })
      : null;

    if (!local_user) {
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
      case text("home"):
        return (
          <div>
            <h1 className="text-2xl text-black">
              {text("greeting")} {user && "name" in user ? user.name : ""}
            </h1>
            <p className="text-black">{text("prompt")}</p>
          </div>
        );

      case text("my_generations"):
        return (
          <h1 className="text-2xl text-black">{text("my_generations")}</h1>
        );

      case text("dress-model"):
        return <h1 className="text-2xl text-black">{text("dress-model")}</h1>;

      case text("txt2img"):
        return <h1 className="text-2xl text-black">{text("txt2img")}</h1>;

      case text("render-traces"):
        return <h1 className="text-2xl text-black">{text("render-traces")}</h1>;

      case text("my_profile"):
        return <h1 className="text-2xl text-black">{text("my_profile")}</h1>;

      default:
        return <h1 className="text-2xl text-black">{mainControl}</h1>;
    }
  }

  return (
    <header className="flex z-[1000] items-center justify-between p-4 bg-[#FFFFFF] text-white fixed w-full border-b border-gray-200 pl-[90px] bg-white">
      {renderHeaderContent()}

      <div>
        <button
          className="border text-2xl bg-gray-200 cursor-pointer text-[#F10641] rounded-[50%] pl-2 pr-2 border-secondary"
          onClick={() => setIsOpenMenuPerfil((prev) => !prev)}
        >
          {user && "name" in user ? user.name[0] : ""}
        </button>
        <KeyboardArrowDownIcon
          className="text-[#F10641] cursor-pointer"
          onClick={() => setIsOpenMenuPerfil((prev) => !prev)}
        />
      </div>
      {isOpenMenuPerfil && (
        <div className="absolute flex flex-col bg-white right-[57px] top-[42px] p-4 z-[1000] rounded box-border border border-gray-200 shadow-md rounded-md">
          <button
            className="hover:cursor-pointer text-black z-[1000] mb-[5px]"
            onClick={() => {
              setIsOpenMenuPerfil((prev) => !prev);
              setMainControl(text("my_profile"));
            }}
          >
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
