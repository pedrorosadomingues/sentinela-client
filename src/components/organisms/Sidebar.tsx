import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaInfoCircle } from "react-icons/fa";
import { AiFillCamera, AiFillPicture } from "react-icons/ai";
import { MdBrush } from "react-icons/md";
import { useTranslations } from "next-intl";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import HistoryIcon from "@mui/icons-material/History";
import { useMainStore, useImageFunctionStore } from "@/zustand-stores";
import { Divider } from "@nextui-org/react";

export default function Sidebar(): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  const { setMainControl, mainControl } = useMainStore();
  const { imageFunctions, getImageFunctions, setImageFunctionName } =
    useImageFunctionStore();

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
      <AiFillPicture
        style={{ fontSize: 30, minWidth: 30 }}
        className={`${!isExpanded && "m-auto"}`}
      />
    ),
    "render-traces": (
      <MdBrush
        style={{ fontSize: 30, minWidth: 30 }}
        className={`${!isExpanded && "m-auto"}`}
      />
    ),
  };

  useEffect(() => {
    getImageFunctions();
    if (
      mainControl === "Home" ||
      mainControl === "Início" ||
      mainControl === "Inicio"
    ) {
      setMainControl(text("home"));
    }
  }, [getImageFunctions]);

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`select-none fixed h-screen left-0 z-40 transition-all duration-700 ease-smooth-return-end 
        ${isExpanded ? "w-[281px]" : "w-20"} 
        bg-white border-r border-gray-200`}
    >
      <div className="p-4 flex flex-col items-center">
        {isExpanded ? (
          <Image
            src={"/images/logo-vestiq.png"}
            alt="Logo"
            width={70}
            height={70}
            priority={true}
          />
        ) : (
          <Image
            src={"/icons/logo-vestiq.png"}
            alt="Logo"
            width={45}
            height={45}
            priority={true}
          />
        )}

        <ul
          className={`mt-4 w-full flex flex-col text-[#565D6DFF] gap-[10px] items-${
            isExpanded ? `start` : `center`
          }`}
        >
          {MAIN_ITEMS.map((item) => (
            <li
              key={item.name}
              className={`mb-2 flex items-center justify-center md:justify-start hover:text-[#F10641] w-full group hover:cursor-pointer rounded-lg p-2 min-w-[50px]
                 ${
                   mainControl === item.name
                     ? "text-[#F10641] bg-[#FED2DD]"
                     : ""
                 }`}
              onClick={() => setMainControl(item.name)}
            >
              {item.icon_path}
              {isExpanded && (
                <span className="ml-3 overflow-hidden whitespace-nowrap group-hover:text-[#F10641]">
                  {item.name}
                </span>
              )}
            </li>
          ))}

          <Divider className="w-2/3 group-hover:w-[100%] mx-auto" />

          {imageFunctions &&
            imageFunctions.map(
              (func: {
                id: string;
                name: keyof typeof ICON_MAPPING;
                title: string;
              }) => (
                <li
                  key={func.id}
                  className={`mb-2 flex items-center justify-center md:justify-start hover:text-[#F10641] w-full group hover:cursor-pointer rounded-lg p-2 min-w-[50px]
                    ${
                      mainControl === text(func.name)
                        ? "text-[#F10641] bg-[#FED2DD]"
                        : ""
                    }`}
                  onClick={() => {
                    setImageFunctionName(func.name);
                    setMainControl(text(func.name));
                  }}
                >
                  {ICON_MAPPING[func.name] || (
                    <FaInfoCircle className="text-xl" />
                  )}
                  {isExpanded && (
                    <span className="ml-3 overflow-hidden whitespace-nowrap">
                      {func.title}
                    </span>
                  )}
                </li>
              )
            )}
        </ul>
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="md:hidden absolute top-4 right-4 bg-black p-2 rounded-full z-50 text-black"
        >
          {isExpanded ? "Close" : "Open"}
        </button>
      </div>
    </aside>
  );
}
