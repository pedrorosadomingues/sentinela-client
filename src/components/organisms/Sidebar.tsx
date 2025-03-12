/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  useFnStore,
  useUserStore,
  useGlobalStore,
} from "@/stores";
import { Button, Card, Divider, Tooltip } from "@heroui/react";
import { ImageFunctionName } from "@/interfaces/image-function";
import HistoryIcon from "@mui/icons-material/History";
import { ICON_MAPPING } from "@/constants";
import {
  HomeOutlined,
  MenuOpenOutlined,
  MonetizationOnOutlined,
} from "@mui/icons-material";
import CoinCouter from "../atoms/CoinCounter";
import { VestiqCoins } from "./icons/VestiqCoins";
import ToggleSidebarLayout from "../atoms/ToggleSidebarLayout";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar(): JSX.Element {
  const { toggleSidebar, sidebar, sidebarLayout, setSidebarLayout } =
    useGlobalStore();
  const router = useRouter();
  const pathname = usePathname();
  const { imageFunctions } = useFnStore();
  const { user } = useUserStore();
  const text = useTranslations("sidebar");

  const MAIN_ITEMS = [
    {
      key: "home",
      name: text("home"),
      icon_path: <HomeOutlined />,
    },
    {
      key: "my_generations",
      name: text("my_generations"),
      icon_path: <HistoryIcon />,
    },
    {
      key: "plans_and_subscriptions",
      name: text("plans_and_subscriptions"),
      icon_path: <MonetizationOnOutlined />,
    },
  ];

  useEffect(() => {
    const storaggedSidebarLayout = localStorage.getItem("sidebar-layout");

    if (storaggedSidebarLayout) {
      setSidebarLayout(storaggedSidebarLayout as "minimized" | "expanded");
    }
  }, []);

  return (
    <>
      <div className={`${sidebarLayout === "minimized" ? "" : "peer group"}`}>
        <aside
          id="app-sidebar"
          className={`select-none
                fixed h-screen left-0 z-40 w-64 lg:w-20 lg:group-hover:w-64 transition-all lg:duration-700 lg:ease-soft-spring pt-4
                ${sidebar ? "-translate-x-full" : "translate-x-0"} 
                lg:translate-x-0 bg-white border-r border-gray-200`}
          aria-label="Sidebar"
        >
          <div className="h-full overflow-x-hidden px-3 lg:group-hover:px-4 pb-4 overflow-y-scroll scrollbar-hide bg-white flex flex-col justify-between">
            <div className="h-full flex flex-col">
              <div className="w-full flex h-24 justify-center px-4 mt-2 bg-gradient-to-b from-white to-white/20 absolute left-0 top-0">
                <div className="w-full z-[41] h-16 bg-white flex items-center justify-between gap-2">
                  <Image
                    src={"/images/logo-vestiq.png"}
                    alt="Logo"
                    className="w-12 aspect-square hidden group-hover:block animate-fade-in"
                    width={70}
                    height={70}
                    priority={true}
                  />
                  <Image
                    src={"/icons/logo-vestiq.ico"}
                    alt="Logo"
                    className="block group-hover:hidden animate-appearance-in"
                    width={45}
                    height={45}
                    priority={true}
                  />
                  <Button
                    isIconOnly
                    onPress={toggleSidebar}
                    className="lg:hidden"
                    variant="ghost"
                  >
                    <MenuOpenOutlined />
                  </Button>
                </div>
              </div>

              <div className="space-y-5 mb-4">
                <ul className="space-y-2 font-medium mt-6 pt-16">
                  {MAIN_ITEMS.map((item) => (
                    <SidebarItem
                      key={item.name}
                      icon={item.icon_path}
                      name={item.name}
                      active={pathname}
                      onPress={() => {
                        let filteredRoute;
                        if (item.key === "home") {
                          filteredRoute = "/main";
                        } else if (item.key === "my_generations") {
                          filteredRoute = "/main/generations?category=results";
                        } else if (item.key === "plans_and_subscriptions") {
                          filteredRoute = "/main/profile?view=plans";
                        }

                        router.push(`${filteredRoute}`);
                        toggleSidebar();
                      }}
                      layout={sidebarLayout}
                    />
                  ))}
                </ul>

                <Divider className="w-2/3 group-hover:w-[90%] mx-auto" />

                <ul className="space-y-2 font-medium overflow-x-hidden overflow-y-hidden pb-20">
                  {imageFunctions.map((func) => (
                    <SidebarItem
                      key={func.id}
                      icon={ICON_MAPPING[func.name as ImageFunctionName](
                        "medium"
                      )}
                      active={pathname.replace("/main/fns/", "")}
                      // @ts-ignore
                      name={text(func.name)}
                      onPress={() => {
                        router.push(`/main/fns/${func.name.toLowerCase()}`);
                        toggleSidebar();
                      }}
                      layout={sidebarLayout}
                    />
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-center gap-8 mt-auto">
                <ToggleSidebarLayout />

                {user && (
                  <>
                    <Tooltip
                      content={<CoinCouter user={user} hideBorder />}
                      placement="right"
                      showArrow
                    >
                      <div className="hidden lg:block lg:group-hover:hidden">
                        <VestiqCoins width={32} height={32} />
                      </div>
                    </Tooltip>

                    <Card
                      className="w-full hidden lg:hidden lg:group-hover:flex flex-row items-center justify-center gap-2 px-4 py-1 border-1.5 border-default-300 text-base"
                      shadow="none"
                      radius="sm"
                    >
                      <VestiqCoins />
                      <span className="text-secondary select-none">
                        {user.v_coins.total -
                          user?.v_coins.current +
                          "/" +
                          user?.v_coins.total}
                      </span>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

const SidebarItem = ({
  icon,
  name,
  active,
  onPress,
  layout,
}: {
  icon: JSX.Element;
  name: string;
  active: string;
  onPress: () => void;
  layout: "minimized" | "expanded";
}) => {
  return (
    <li
      onClick={onPress}
      className={`cursor-pointer flex items-center p-2 lg:w-fit lg:group-hover:w-full lg:mx-auto lg:justify-center lg:group-hover:justify-start
                  ${active === name ? "text-secondary bg-secondary/10" : ""}    
        rounded-lg hover:text-secondary hover:fill-secondary group text-gray-500 fill-gray-500`}
    >
      {layout === "minimized" ? (
        <Tooltip content={name} showArrow color="foreground" placement="right">
          <div className="relative">{icon}</div>
        </Tooltip>
      ) : (
        <div className="relative">{icon}</div>
      )}
      {layout !== "minimized" && (
        <span className="lg:hidden lg:group-hover:block ms-3 text-xs lg:text-sm 3xl:text-base whitespace-nowrap">
          {name}
        </span>
      )}
    </li>
  );
};
