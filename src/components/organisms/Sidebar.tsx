/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Image from "next/image";
import { FaInfoCircle } from "react-icons/fa";
import { AiFillCamera } from "react-icons/ai";
import { useTranslations } from "next-intl";
import {
  useMainStore,
  useImageFunctionStore,
  useUserStore,
  useSidebarStore,
} from "@/zustand-stores";
import { Divider } from "@nextui-org/react";
import { ImageFunction, ImageFunctionName } from "@/interfaces/image-function";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import HistoryIcon from "@mui/icons-material/History";
import CoinsHoverBox from "../atoms/VCoinsbox";
import { User } from "@/interfaces";
import ExpandSideBarButton from "@/components/atoms/ExpandSideBarButton";

export default function Sidebar(): JSX.Element {
  const {
    isExpanded,
    isLocked,
    openCoinModal,
    setOpenCoinModal,
    setIsExpanded,
    setIsLocked,
  } = useSidebarStore();

  const { setMainControl, mainControl } = useMainStore();
  const { imageFunctions, getImageFunctions } = useImageFunctionStore();
  const { user } = useUserStore();

  const text = useTranslations("sidebar");

  const MAIN_ITEMS = [
    {
      name: text("home"),
      icon_path: (
        <CheckroomIcon
          style={{ fontSize: 30 }}
          className={`${!isExpanded && "m-auto"}`}
        />
      ),
    },
    {
      name: text("my_generations"),
      icon_path: (
        <HistoryIcon
          style={{ fontSize: 30, minWidth: 30 }}
          className={`${!isExpanded && "m-auto"}`}
        />
      ),
    },
  ];

  const ICON_MAPPING = {
    "dress-model": (
      <AiFillCamera
        style={{ fontSize: 30, minWidth: 30 }}
        className={`${!isExpanded && "m-auto"}`}
      />
    ),
    txt2img: (
      <BorderColorIcon
        style={{ fontSize: 30, minWidth: 30 }}
        className={`${!isExpanded && "m-auto"}`}
      />
    ),
    "render-traces": (
      <DesignServicesIcon
        style={{ fontSize: 30, minWidth: 30 }}
        className={`${!isExpanded && "m-auto"}`}
      />
    ),
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
    setIsExpanded(!isExpanded);
  };

  const handleMouseEnter = () => {
    if (!isLocked) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isLocked) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    getImageFunctions();

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
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`select-none fixed h-screen left-0 z-[5000] transition-all duration-700 ease-smooth-return-end overflow-hidden
        ${isExpanded ? "w-[281px] flex items-start" : "w-20 max765:w-0"} 
        bg-white border-r border-gray-200`}
    >
      <div className="p-4 flex flex-col items-center relative h-full">
        {isExpanded ? (
          <div className="flex">
            <Image
              src={"/images/logo-vestiq.png"}
              alt="Logo"
              style={{ height: "auto" }}
              width={70}
              height={70}
              priority={true}
            />
            <div className="min765:hidden">
              <ExpandSideBarButton
                isLocked={isLocked}
                isExpanded={isExpanded}
                openCoinModal={openCoinModal}
                user={user as User}
                toggleLock={toggleLock}
                setOpenCoinModal={setOpenCoinModal}
              />
            </div>
          </div>
        ) : (
          <Image
            src={"/icons/logo-vestiq.ico"}
            alt="Logo"
            style={{ height: "auto" }}
            width={45}
            height={45}
            priority={true}
          />
        )}
        <div className="flex flex-col justify-between h-full">
          <ul
            className={`mt-4 w-full flex flex-col text-[#565D6DFF] gap-[10px] items-center
            }`}
          >
            {MAIN_ITEMS.map((item) => (
              <li
                key={item.name}
                className={` mb-2 flex items-center justify-center md:justify-start hover:text-[#F10641] w-full group hover:cursor-pointer rounded-lg p-2 min-w-[50px]
                   ${
                     mainControl === item.name
                       ? "text-[#F10641] bg-[#FED2DD]"
                       : ""
                   }`}
                onClick={() => setMainControl(item.name)}
              >
                {item.icon_path}
                {isExpanded && (
                  <span className="ml-[6px] overflow-hidden whitespace-nowrap group-hover:text-[#F10641] text-[16px]  transition-all duration-700 ease-smooth-return-end">
                    {item.name}
                  </span>
                )}
              </li>
            ))}

            <Divider className="w-2/3 group-hover:w-[100%] mx-auto" />

            {imageFunctions &&
              imageFunctions.map((func: ImageFunction) => (
                <li
                  key={func.id}
                  className={`mb-2 flex items-center justify-center md:justify-start hover:text-[#F10641] w-full group hover:cursor-pointer rounded-lg p-2 min-w-[50px]  transition-all duration-700 ease-smooth-return-end
                      ${
                        mainControl === text(func.name)
                          ? "text-[#F10641] bg-[#FED2DD]"
                          : ""
                      } `}
                  onClick={() => {
                    setMainControl(text(func.name));
                  }}
                >
                  {ICON_MAPPING[func.name as ImageFunctionName] || (
                    <FaInfoCircle
                      className={`text-xl ${!isExpanded && "m-auto"}`}
                    />
                  )}
                  {isExpanded && (
                    <span className="ml-[6px] overflow-hidden whitespace-nowrap text-[16px]">
                      {text(func.name)}
                    </span>
                  )}
                </li>
              ))}
          </ul>
          <div>
            <div className="max765:hidden">
              <ExpandSideBarButton
                isLocked={isLocked}
                isExpanded={isExpanded}
                openCoinModal={openCoinModal}
                user={user as User}
                toggleLock={toggleLock}
                setOpenCoinModal={setOpenCoinModal}
              />
            </div>
            <CoinsHoverBox
              isLocked={isLocked}
              isExpanded={isExpanded}
              openCoinModal={openCoinModal}
              user={user as User}
              setOpenCoinModal={setOpenCoinModal}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
