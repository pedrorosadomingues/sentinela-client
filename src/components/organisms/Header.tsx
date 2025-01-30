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
import { Avatar, Button } from "@heroui/react";
import Image from "next/image";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { LOCALE_TO_FLAG, LOCALES } from "@/constants/locales";
import { StarGroup } from "./icons";
import CoinCounter from "../atoms/CoinCounter";
import { Menu } from "@mui/icons-material";

export default function Header(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("header");
  const pathname = usePathname();
  const currentLocale = useLocale();

  const { user, getUser, setUser } = useUserStore();
  const { mainControl, setMainControl } = useMainStore();
  const { toggleSidebar } = useSidebarStore();

  const [tab, setTab] = useState<string | null>(null);

  function handleLogout(): void {
    logout();
    router.push(`/${locale}`);
    setUser(null);
  }

  useEffect(() => {
    const stored_user_id = localStorage.getItem("user_id");
    const stored_user_name = localStorage.getItem("user_name");
    const local_user = stored_user_id ? getUser(stored_user_id) : null;

    const timeout = setTimeout(() => {
      if (!local_user || stored_user_name !== user?.name) {
        redirect(`/${locale}`);
      }
    }, 2000);

    const currentTab = searchParams.get("tab");
    if (currentTab) {
      setMainControl(currentTab);
      setTab(currentTab);
    }
    if (user?.name !== undefined && user?.name !== stored_user_name) {
      alert("Please login again");
      handleLogout();
    }
    return () => clearTimeout(timeout);
  }, [getUser, searchParams, setMainControl, router, locale]);

  function renderHeaderContent() {
    const current = mainControl || tab;

    switch (current) {
      case t("home"):
        return (
          user?.name && (
            <div>
              <h1 className="text-xl font-medium text-black">
                {t("greeting")} {user.name}!
              </h1>
              <p className="text-black">{t("prompt")}</p>
            </div>
          )
        );

      case t("my_generations"):
        return <h1 className="text-2xl text-black">{t("my_generations")}</h1>;

      case t("dress-model"):
        return <h1 className="text-2xl text-black">{t("dress-model")}</h1>;

      case t("txt2img"):
        return <h1 className="text-2xl text-black">{t("txt2img")}</h1>;

      case t("render-traces"):
        return <h1 className="text-2xl text-black">{t("render-traces")}</h1>;

      case t("my_profile"):
        return <h1 className="text-2xl text-black">{t("my_profile")}</h1>;

      default:
        return <h1 className="text-2xl text-black">{mainControl}</h1>;
    }
  }

  function handleAction(key: string): void {
    switch (key) {
      case "my_profile":
        setMainControl(t("my_profile"));
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
    <header className="flex items-center justify-between px-4 min-h-16 text-white fixed z-10 w-full border-b border-gray-200 pl-[90px] bg-white max765:pl-5">
      <div className="hidden md:block">{renderHeaderContent()}</div>
      <div className="md:hidden flex gap-2">
        <Button
          isIconOnly
          variant="light"
          radius="full"
          className="text-gray-400"
          onPress={toggleSidebar}
        >
          <Menu />
        </Button>
        <Image
          src={"/icons/logo-vestiq.ico"}
          alt="Logo"
          className="block group-hover:hidden animate-appearance-in"
          width={45}
          height={45}
          priority={true}
        />
      </div>

      <aside className="flex items-center gap-2">
        <Button
          color="secondary"
          size="sm"
          radius="sm"
          className="hidden sm:flex"
          startContent={<StarGroup />}
        >
          {t("subscribe_now")}
        </Button>
        {user && <CoinCounter user={user} />}

        <Dropdown placement="bottom-end" showArrow shouldBlockScroll={false}>
          <DropdownTrigger>
            <Avatar
              as="div"
              size="sm"
              className="transition-transform cursor-pointer ml-1"
              isBordered={user?.avatar ? false : true}
              classNames={{
                name: "text-2xl text-secondary",
                base: "bg-gray-200",
              }}
              showFallback
              color="secondary"
              name={user?.name[0]}
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
              <p className="font-semibold">{user?.email}</p>
            </DropdownItem>
            <DropdownItem key="my_profile">{t("my_profile")}</DropdownItem>
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
                      {LOCALE_TO_FLAG[locale as keyof typeof LOCALE_TO_FLAG]}
                    </option>
                  ))}
                </select>
              }
            >
              {t("language_switcher")}
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              {t("logout")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </aside>
    </header>
  );
}
