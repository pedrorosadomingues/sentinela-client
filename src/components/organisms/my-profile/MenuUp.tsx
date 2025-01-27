/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useMyProfileStore } from "@/zustand-stores";
import { Divider } from "@heroui/react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

export default function MenuUp(): JSX.Element {
  const { setProfileControl, profileControl } = useMyProfileStore();

  const text = useTranslations("menu_profile");

const ICON_MAPPING = [
  { name: text("user_profile"), icon: <PersonOutlineIcon /> },
  { name: text("personal_data"), icon: <AssignmentIndIcon /> },
  { name: text("plan_billing"), icon: <AccountBalanceIcon /> },
]
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
      className={`select-none z-[4000] flex items-center justify-center bg-white border-r border-gray-200 min765:hidden mr-[100px]`}
    >
      <div className="flex items-center  justify-between h-full">
        <ul
          className={`mt-4 flex text-[#565D6DFF] gap-[50%]           `}
        >
          {ICON_MAPPING.map((item) => (
            <li
              key={item.name}
              className={` mb-2 flex flex-col items-center justify-center md:justify-start hover:text-[#F10641] w-full group hover:cursor-pointer rounded-lg p-2 
                   ${
                     profileControl === item.name
                       ? "text-[#F10641] bg-[#FED2DD]"
                       : ""
                   }`}
              onClick={() => setProfileControl(item.name)}
            >
              <span className="overflow-hidden whitespace-nowrap group-hover:text-[#F10641] text-[16px]  transition-all duration-700 ease-smooth-return-end">
                {item.icon}
              </span>
              <Divider />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
