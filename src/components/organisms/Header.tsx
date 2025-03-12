/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { logout } from "@/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useUserStore, useGlobalStore } from "@/stores";
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
import { useToast } from "@/hooks/useToast";
import { useEffect, useState } from "react";
import VestiqLoading from "./VestiqLoading";
import Cookies from "js-cookie";

export default function Header(): JSX.Element {
  const router = useRouter();
  const t = useTranslations("header");
  const profileT = useTranslations("profile.tabs");
  const pathname = usePathname();
  const params = useSearchParams();
  const currentLocale = useLocale();
  const toast = useToast();
  const { user } = useUserStore();
  const { toggleSidebar, currentPathname, setCurrentPathname } =
    useGlobalStore();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  async function handleLogout(): Promise<void> {
    const success: boolean = await logout();

    if (success) {
      Cookies.remove("vq-access-token", { path: "/" });
      setIsLogoutLoading(false);

      router.push("/auth");

      return router.refresh();
    } else {
      toast.use("error", "Erro ao tentar deslogar. Tente novamente.");
      setIsLogoutLoading(false);
    }
  }

  function handleAction(key: string): void {
    switch (key) {
      case "my_profile":
        router.push("/main/profile?view=profile");
        break;
      case "logout":
        handleLogout();
        break;
    }
  }

  const handleLocaleChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  const handleUpdateCurrentPathname = () => {
    const currentPath = pathname.split("/").pop();

    const paramsList = Array.from(params.entries()).map(([key, value]) => {
      return { key, value };
    });

    const selectedParam = paramsList[0];

    if (
      (currentPath === "generations" && selectedParam.key === "category") ||
      (currentPath === "profile" && selectedParam.key === "view")
    ) {
      setCurrentPathname({
        basePathname: currentPath,
        subPathname: null,
        param: selectedParam,
      });
    } else {
      setCurrentPathname({
        basePathname: currentPath as string,
        subPathname: null,
        param: null,
      });
    }
  };

  function HeaderPageTitle() {
    const current =
      currentPathname?.param?.value ?? currentPathname?.basePathname;

    switch (current) {
      case "results":
        return <h1 className="text-2xl text-black">{t("my_generations")}</h1>;

      case "models":
        return <h1 className="text-2xl text-black">{t("my_models")}</h1>;

      case "dress-model":
        return <h1 className="text-2xl text-black">{t("dress-model")}</h1>;

      case "txt2img":
        return <h1 className="text-2xl text-black">{t("txt2img")}</h1>;

      case "render-traces":
        return <h1 className="text-2xl text-black">{t("render-traces")}</h1>;

      case "profile":
      case "plans":
      case "team":
      case "personal":
      case "achievements":
        return <h1 className="text-2xl text-black">{profileT(current)}</h1>;
      default:
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
    }
  }

  useEffect(() => {
    handleUpdateCurrentPathname();
  }, [pathname, params]);

  if (isLogoutLoading) {
    return <VestiqLoading />;
  }

  return (
    <header className="flex items-center justify-between px-4 min-h-16 text-white fixed z-10 w-full border-b border-gray-200 lg:pl-[90px] bg-white max765:pl-5">
      <div className="hidden lg:block">
        <HeaderPageTitle />
      </div>
      <div className="lg:hidden flex gap-2">
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
          onPress={() => router.push("/main/plans")}
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
