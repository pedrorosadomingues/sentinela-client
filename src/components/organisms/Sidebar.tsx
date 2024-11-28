import React, { useState } from "react";
import Image from "next/image";
import { FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { useTranslations } from "next-intl";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HistoryIcon from "@mui/icons-material/History";
import { useHomeStore } from "@/zustand-stores/homeStore";

export default function Sidebar(): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  const { setHomeControl } = useHomeStore();

  const text = useTranslations("sidebar");

  const MAIN_ITEMS = [
    {
      name: text("home"),
      icon_path: <PersonOutlineIcon style={{ fontSize: 30 }} />,
    },
    {
      name: text("my_generations"),
      icon_path: <HistoryIcon style={{ fontSize: 30 }} />,
    },
  ];

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`select-none fixed h-screen left-0 z-40 transition-all duration-700 ease-smooth-return pt-4
        ${isExpanded ? "w-64" : "w-20"} 
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
          className={`mt-4 w-full flex flex-col items-${
            isExpanded ? `start` : `center`
          }`}
        >
          {MAIN_ITEMS.map((item) => (
            <li
              key={item.name}
              className="mb-2 flex items-center justify-center md:justify-start hover:text-[#F10641] group hover:cursor-pointer"
              onClick={() => setHomeControl(item.name)}
            >
              {item.icon_path}
              {isExpanded && (
                <span className="ml-3 overflow-hidden whitespace-nowrap group-hover:text-[#F10641]">
                  {item.name}
                </span>
              )}
            </li>
          ))}
          <li className="mb-2 flex items-center justify-center md:justify-start">
            <FaInfoCircle className="text-xl" />
            {isExpanded && <span className="ml-3 overflow-hidden">About</span>}
          </li>
          <li className="mb-2 flex items-center justify-center md:justify-start">
            <FaEnvelope className="text-xl" />
            {isExpanded && (
              <span className="ml-3 overflow-hidden">Contact</span>
            )}
          </li>
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
