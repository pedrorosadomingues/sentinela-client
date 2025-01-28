/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { logout } from "@/utils";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useUserStore, useMainStore, useSidebarStore } from "@/zustand-stores";
import { Avatar } from "@heroui/react";
import ExpandSideBarButton from "@/components/atoms/ExpandSideBarButton";
import { User } from "@/interfaces";
import Image from "next/image";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { LOCALE_TO_FLAG, LOCALES } from "@/constants/locales";

export default function Header(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const text = useTranslations("header");
  const pathname = usePathname();
  const currentLocale = useLocale();

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

  // Função para controlar as ações do Dropdown
  function handleAction(key: string): void {
    switch (key) {
      case "my_profile":
        setMainControl(text("my_profile"));
        break;
      case "logout":
        handleLogout();
        break;
    }
  }

  const handleLocaleChange = (locale: string) => {
    const pathnameWithoutLocale = pathname.replace(
      new RegExp(`^/${currentLocale}`),
      ""
    );
    router.push(`/${locale}${pathnameWithoutLocale}`);
  };

  return (
    <header className="flex items-center justify-between py-2 px-4 text-white fixed z-10 w-full border-b border-gray-200 pl-[90px] bg-white max765:pl-5">
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

      <aside className="flex items-center gap-4">
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
        </div>
        <Dropdown placement="bottom-end" showArrow>
          <DropdownTrigger>
            <Avatar
              as="div"
              size="sm"
              className="transition-transform cursor-pointer"
              isBordered={
                user && "avatar" in user && user.avatar ? false : true
              }
              classNames={{
                name: "text-2xl text-secondary",
                base: "bg-gray-200",
              }}
              showFallback
              color="secondary"
              name={user && "name" in user ? user.name[0] : ""}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            onAction={(key) => handleAction(key as string)}
          >
            <DropdownItem
              key="profile"
              className="h-14 gap-2 cursor-default"
              textValue="signed user info"
              isReadOnly
            >
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">
                {user && "email" in user ? user.email : ""}
              </p>
            </DropdownItem>
            <DropdownItem key="my_profile">{text("my_profile")}</DropdownItem>
            <DropdownItem
              key="locale_switcher"
              isReadOnly
              className="cursor-default"
              textValue="Language Switcher"
              endContent={
                <select
                  className="z-10 mx-auto outline-none p-2 rounded-md text-tiny border-small bg-transparent text-default-500"
                  id="locale-switcher"
                  name="locale-switcher"
                  onChange={(e) => handleLocaleChange(e.target.value)}
                  value={currentLocale}
                >
                  {LOCALES.map((locale) => (
                    <option key={locale} value={locale}>
                      <span role="img" aria-label={locale}>
                        {LOCALE_TO_FLAG[locale as keyof typeof LOCALE_TO_FLAG]}
                      </span>
                    </option>
                  ))}
                </select>
              }
            >
              Trocar idioma
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              {text("logout")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </aside>
    </header>
  );
}
