/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  useMainStore,
  useImageFunctionStore,
  useUserStore,
  useSidebarStore,
} from "@/zustand-stores";
import { Button, Card, Divider, Tooltip } from "@heroui/react";
import { ImageFunctionName } from "@/interfaces/image-function";
import HistoryIcon from "@mui/icons-material/History";
import { ICON_MAPPING } from "@/constants";
import { HomeOutlined, MenuOpenOutlined } from "@mui/icons-material";
import CoinCouter from "../atoms/CoinCounter";
import { VestiqCoins } from "./icons/VestiqCoins";
import ToggleSidebarLayout from "../atoms/ToggleSidebarLayout";

export default function Sidebar(): JSX.Element {
  const { toggleSidebar, sidebar, sidebarLayout } = useSidebarStore();
  const locale = useLocale();
  const { setMainControl, mainControl } = useMainStore();
  const { imageFunctions, getImageFunctions } = useImageFunctionStore();
  const { user } = useUserStore();
  const text = useTranslations("sidebar");

  const MAIN_ITEMS = [
    {
      name: text("home"),
      icon_path: <HomeOutlined />,
    },
    {
      name: text("my_generations"),
      icon_path: <HistoryIcon />,
    },
  ];

  useEffect(() => {
    getImageFunctions(locale);

    const normalizedControl = mainControl.toLowerCase();

    switch (normalizedControl) {
      case "home":
      case "início":
      case "inicio":
        setMainControl(text("home"));
        break;

      case "minhas gerações":
      case "my generations":
      case "mis generaciones":
        setMainControl(text("my_generations"));
        break;

      case "vestir modelo":
      case "dress model":
        setMainControl(text("dress-model"));
        break;

      case "imagem a partir de texto":
      case "image from text":
      case "imagen a partir de texto":
        setMainControl(text("txt2img"));
        break;

      case "renderizar traços":
      case "render traces":
      case "renderizar trazos":
        setMainControl(text("render-traces"));
        break;

      default:
        break;
    }
  }, [getImageFunctions]);

  return (
    <>
      <div className={`${sidebarLayout === "minimized" ? "" : "peer group"}`}>
        <aside
          id="app-sidebar"
          className={`select-none
                fixed h-screen left-0 z-40 w-64 md:w-20 md:group-hover:w-64 transition-all md:duration-700 md:ease-soft-spring pt-4
                ${sidebar ? "-translate-x-full" : "translate-x-0"} 
                md:translate-x-0 bg-white border-r border-gray-200`}
          aria-label="Sidebar"
        >
          <div className="h-full overflow-x-hidden px-3 md:group-hover:px-4 pb-4 overflow-y-scroll scrollbar-hide bg-white flex flex-col justify-between">
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
                    className="md:hidden"
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
                      active={mainControl}
                      onPress={() => setMainControl(item.name)}
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
                      active={mainControl}
                      name={text(func.name)}
                      onPress={() => setMainControl(text(func.name))}
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
                      <div className="hidden md:block md:group-hover:hidden">
                        <VestiqCoins width={32} height={32} />
                      </div>
                    </Tooltip>

                    <Card
                      className="w-full flex md:hidden md:group-hover:flex flex-row items-center justify-center gap-2 px-4 py-1 border-1.5 border-default-300 text-base"
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
      className={`cursor-pointer flex items-center p-2 md:w-fit md:group-hover:w-full md:mx-auto md:justify-center md:group-hover:justify-start
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
        <span className="md:hidden md:group-hover:block ms-3 text-xs md:text-sm 3xl:text-base whitespace-nowrap">
          {name}
        </span>
      )}
    </li>
  );
};
