/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaInfoCircle } from "react-icons/fa";
import { AiFillCamera } from "react-icons/ai";
import { useTranslations } from "next-intl";
import { useMainStore, useImageFunctionStore } from "@/zustand-stores";
import { Divider } from "@nextui-org/react";
import { ImageFunction, ImageFunctionName } from "@/interfaces/imageFunction";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import HistoryIcon from "@mui/icons-material/History";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

export default function Sidebar(): JSX.Element {
  const { setMainControl, mainControl } = useMainStore();

  const text = useTranslations("sidebar");

  const MAIN_ITEMS = [
    {
      name: text("home"),
    },
    {
      name: text("my_generations"),
    },
  ];

  useEffect(() => {

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
  }, []);

  return (
    <div
      className={`select-none z-[4000] w-[251px] flex items-start bg-white border-r border-gray-200`}
    >
      <div className="p-4 flex flex-col items-center relative h-full">
        <div className="flex flex-col justify-between h-full">
          <ul
            className={`mt-4 w-full flex flex-col text-[#565D6DFF] gap-[10px] items-center
            }`}
          >
            {MAIN_ITEMS.map((item) => (
              <li
                key={item.name}
                className={` mb-2 flex flex-col items-center justify-center md:justify-start hover:text-[#F10641] w-full group hover:cursor-pointer rounded-lg p-2 min-w-[50px]
                   ${
                     mainControl === item.name
                       ? "text-[#F10641] bg-[#FED2DD]"
                       : ""
                   }`}
                onClick={() => setMainControl(item.name)}
              >
                <span className="ml-[6px] overflow-hidden whitespace-nowrap group-hover:text-[#F10641] text-[16px]  transition-all duration-700 ease-smooth-return-end">
                  {item.name}
                </span>
                <Divider />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
