/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Image from "next/image";
import { FaInfoCircle } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import {
  useMainStore,
  useImageFunctionStore,
  useUserStore,
  useSidebarStore,
} from "@/zustand-stores";
import { Card, Divider, Tooltip } from "@heroui/react";
import { ImageFunctionName } from "@/interfaces/image-function";
import HistoryIcon from "@mui/icons-material/History";
import ExpandSideBarButton from "@/components/atoms/ExpandSideBarButton";
import { ICON_MAPPING } from "@/constants";
import { HomeOutlined } from "@mui/icons-material";
import CoinCouter from "../atoms/CoinCounter";
import { VestiqCoins } from "./icons/VestiqCoins";

export default function Sidebar(): JSX.Element {
  const {
    isExpanded,
    isLocked,
    openCoinModal,
    setOpenCoinModal,
    setIsExpanded,
    setIsLocked,
  } = useSidebarStore();
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

  const toggleLock = () => {
    setIsLocked(!isLocked);
    setIsExpanded(!isExpanded);
  };

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
    <aside className={`${isLocked && "group"}`}>
      <nav
        className={`
          p-4
          ${isExpanded ? "w-52" : "w-20 group-hover:w-52"}
          hidden md:flex items-center group-hover:items-start
          select-none overflow-hidden
          fixed z-10 h-screen left-0 
          transition-all duration-500 
          bg-white border-r border-gray-200
        `}
      >
        <div className="flex flex-col gap-4 h-full">
          <div className="mb-4 h-16">
            <div className="hidden group-hover:flex animate-fade-in">
              <Image
                src={"/images/logo-vestiq.png"}
                alt="Logo"
                style={{ height: "auto" }}
                width={70}
                height={70}
                priority={true}
              />
              <div className="md:hidden">
                <ExpandSideBarButton
                  isLocked={isLocked}
                  isExpanded={isExpanded}
                  openCoinModal={openCoinModal}
                  user={user}
                  toggleLock={toggleLock}
                  setOpenCoinModal={setOpenCoinModal}
                />
              </div>
            </div>
            <Image
              src={"/icons/logo-vestiq.ico"}
              alt="Logo"
              className="block group-hover:hidden animate-appearance-in"
              style={{ height: "auto" }}
              width={45}
              height={45}
              priority={true}
            />
          </div>

          <div className="flex flex-col justify-between h-full">
            <ul
              className={`w-full flex flex-col text-[#565D6DFF] gap-[10px]
            }`}
            >
              {MAIN_ITEMS.map((item) => (
                <li
                  key={item.name}
                  className={`mb-2 flex items-center justify-center md:justify-start hover:text-secondary w-fit group-hover:w-full hover:cursor-pointer rounded-lg p-2
                   ${
                     mainControl === item.name
                       ? "text-secondary bg-secondary/10"
                       : ""
                   }`}
                  onClick={() => {
                    setMainControl(item.name);
                    setIsExpanded(false);
                  }}
                >
                  {item.icon_path}

                  <span className="hidden group-hover:block ml-[6px] overflow-hidden whitespace-nowrap group-hover:text-secondary transition-all duration-700 ease-smooth-return-end">
                    {item.name}
                  </span>
                </li>
              ))}

              <Divider className="w-2/3 group-hover:w-full" />

              {imageFunctions.map((func) => (
                <li
                  key={func.id}
                  className={`mb-2 flex items-center justify-center md:justify-start hover:text-secondary w-fit group-hover:w-full hover:cursor-pointer rounded-lg p-2 transition-all duration-700 ease-smooth-return-end
                      ${
                        mainControl === text(func.name)
                          ? "text-secondary bg-secondary/10"
                          : ""
                      } `}
                  onClick={() => {
                    setMainControl(text(func.name));
                    setIsExpanded(false);
                  }}
                >
                  {ICON_MAPPING[func.name as ImageFunctionName]("medium") || (
                    <FaInfoCircle
                      className={`text-xl ${!isExpanded && "m-auto"}`}
                    />
                  )}
                  <span className="hidden group-hover:block ml-[6px] overflow-hidden whitespace-nowrap">
                    {text(func.name)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center gap-8">
              <div className="hidden md:block">
                <ExpandSideBarButton
                  isLocked={isLocked}
                  isExpanded={isExpanded}
                  openCoinModal={openCoinModal}
                  user={user}
                  toggleLock={toggleLock}
                  setOpenCoinModal={setOpenCoinModal}
                />
              </div>

              {user && (
                <>
                  <Tooltip
                    content={<CoinCouter user={user} hideBorder />}
                    placement="right"
                    showArrow
                  >
                    <div className="group-hover:hidden">
                      <VestiqCoins width={32} height={32} />
                    </div>
                  </Tooltip>

                  <Card
                    className="w-full hidden group-hover:flex flex-row items-center justify-center gap-2 px-4 py-1 border-1.5 border-default-300 text-base"
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
      </nav>
    </aside>
  );
}
