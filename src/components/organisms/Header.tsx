/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { logout } from "@/utils";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useUserStore, useMainStore, useSidebarStore } from "@/zustand-stores";
import LanguageSwitcher from "./MainLanguageSwitcher";
import { Divider } from "@heroui/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandSideBarButton from "@/components/atoms/ExpandSideBarButton";
import { User } from "@/interfaces";
import Image from "next/image";

export default function Header(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const text = useTranslations("header");

  const { user, getUser, setUser } = useUserStore();
  const { mainControl, setMainControl } = useMainStore();
  const {
    isExpanded,
    isLocked,
    openCoinModal,
    setOpenCoinModal,
    setIsExpanded,
    setIsLocked,
  } = useSidebarStore();

  const [tab, setTab] = useState<string | null>(null);
  const [isOpenMenuPerfil, setIsOpenMenuPerfil] = useState(false);

  function handleLogout(): void {
    logout();
    router.push(`/${locale}`);
    setUser(null);
  }
  function toggleLock(): void {
    setIsLocked(!isLocked);
    setIsExpanded(!isExpanded);
  }

  useEffect(() => {
    const stored_user_id = localStorage.getItem("user_id");
    const stored_user_name = localStorage.getItem("user_name");
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
    if (
      (user as User)?.name !== undefined &&
      (user as User)?.name !== stored_user_name
    ) {
      alert("Please login again");
      handleLogout();
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
    <header className="flex items-center justify-between p-4 text-white fixed z-10 w-full border-b border-gray-200 pl-[90px] bg-white max765:pl-5">
      <div className="max765:hidden">{renderHeaderContent()}</div>
      <div className="min765:hidden flex">
        <ExpandSideBarButton
          isLocked={isLocked}
          isExpanded={isExpanded}
          openCoinModal={openCoinModal}
          user={user as User}
          toggleLock={toggleLock}
          setOpenCoinModal={setOpenCoinModal}
        />
        <Image
          src={"/images/logo-vestiq.png"}
          alt="Logo"
          style={{ height: "auto" }}
          width={70}
          height={70}
          priority={true}
        />
      </div>

      <div className="flex gap-2">
        <Image
          src="/icons/coins-icon.png"
          alt="Logo"
          width={30}
          height={30}
          priority={true}
        />

        {user && "v_coins" in user && (
          <span className="text-[#F10641]">
            {Number(user.v_coins).toFixed(2)}V
          </span>
        )}
        <div className="ml-[35px]">
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
