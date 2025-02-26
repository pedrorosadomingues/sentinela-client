/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useProfileStore } from "@/stores";
import { Divider } from "@heroui/react";

export default function MenuProfile(): JSX.Element {
  const { setProfileControl, profileControl } = useProfileStore();

  const text = useTranslations("menu_profile");

  const MAIN_ITEMS = [
    {
      name: text("user_profile"),
    },
    {
      name: text("personal_data"),
    },
    { name: text("plan_billing") },
  ];

  useEffect(() => {
    const normalizedControl = profileControl.toLowerCase();

    switch (normalizedControl) {
      case "user profile":
      case "perfil de usuario":
      case "perfil do usuário":
        setProfileControl(text("user_profile"));
        break;

      case "datos personales":
      case "dados pessoais":
      case "peronal data":
        setProfileControl(text("personal_data"));
        break;

      case "plan & billing":
      case "plano e faturamento":
      case "plan y facturación":
        setProfileControl(text("plan_billing"));
        break;

      default:
        break;
    }
  }, []);

  return (
    <div
      className={`select-none flex items-start bg-white max765:hidden mr-4`}
    >
      <div className="flex flex-col justify-between h-full">
        <ul
          className={`mt-4 w-full flex flex-col text-[#565D6DFF] gap-[10px] items-center
           `}
        >
          {MAIN_ITEMS.map((item) => (
            <li
              key={item.name}
              className={` mb-2 flex flex-col items-center justify-center md:justify-start hover:text-secondary w-full group hover:cursor-pointer rounded-lg p-2 min-w-[50px]
                   ${
                     profileControl === item.name
                       ? "text-secondary bg-[#FED2DD]"
                       : ""
                   }`}
              onClick={() => setProfileControl(item.name)}
            >
              <span className="ml-[6px] overflow-hidden whitespace-nowrap group-hover:text-secondary text-[16px]  transition-all duration-700 ease-smooth-return-end">
                {item.name}
              </span>
              <Divider />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
