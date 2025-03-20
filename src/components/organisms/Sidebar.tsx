/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  useFnStore,
  useUserStore,
  useGlobalStore,
  usePlanStore,
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
  let { imageFunctions } = useFnStore();
  const { user } = useUserStore();
  const availableFunctions = Array.isArray(user?.plan?.available_resources)
    ? user.plan.available_resources.map((fn) => fn as string)
    : [];
  const { setIsOpenUpgradeModal } = usePlanStore();
  const text = useTranslations("sidebar");

  if (user?.email === "coralfitness6@gmail.com") {
    imageFunctions = imageFunctions.filter(
      (func) => func.name === "dress-model"
        // Array.isArray(user?.plan?.available_resources) &&
        // user.plan.available_resources.includes(func.name)
    );
  }

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
          <div className="flex flex-col bg-white h-full justify-between lg:group-hover:px-4 overflow-x-hidden overflow-y-scroll pb-4 px-3 scrollbar-hide">
            <div className="flex flex-col h-full">
              <div className="flex bg-gradient-to-b h-24 justify-center w-full absolute from-white left-0 mt-2 px-4 to-white/20 top-0">
                <div className="flex bg-white h-16 justify-between w-full gap-2 items-center z-[41]">
                  <Image
                    src={"/images/logo-vestiq.png"}
                    alt="Logo"
                    className="w-12 animate-fade-in aspect-square group-hover:block hidden"
                    width={70}
                    height={70}
                    priority={true}
                  />
                  <Image
                    src={"/icons/logo-vestiq.ico"}
                    alt="Logo"
                    className="animate-appearance-in block group-hover:hidden"
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

              <div className="mb-4 space-y-5">
                <ul className="font-medium mt-6 pt-16 space-y-2">
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

                <ul className="font-medium overflow-x-hidden overflow-y-hidden pb-20 space-y-2">
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
                        toggleSidebar();
                        router.push(`/main/fns/${func.name.toLowerCase()}`);

                        // toggleSidebar();

                        // if (availableFunctions.includes(func.name)) {
                        //   router.push(`/main/fns/${func.name.toLowerCase()}`);
                        // } else {
                        //   setIsOpenUpgradeModal(true);
                        // };
                      }}
                      layout={sidebarLayout}
                    />
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-8 items-center mt-auto">
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
                      className="flex-row border-1.5 border-default-300 justify-center text-base w-full gap-2 hidden items-center lg:group-hover:flex lg:hidden px-4 py-1"
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
        <span className="text-xs 3xl:text-base lg:group-hover:block lg:hidden lg:text-sm ms-3 whitespace-nowrap">
          {name}
        </span>
      )}
    </li>
  );
};
