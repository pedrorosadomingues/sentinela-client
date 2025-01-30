import { useTranslations } from "next-intl";
import React from "react";

export default function Card({
  title,
  description,
  isBeta,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  isBeta: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  const t = useTranslations("home");

  return (
    <div
      className={`border relative border-gray-200 rounded-lg p-6 shadow-md 
        flex flex-col items-start bg-white gap-2 flex-1 animate-fade-in hover:shadow-lg text-secondary`}
    >
      {icon}
      <div className="flex items-center justify-between w-full">
        <h3 className=" mt-[5px] text-lg font-bold text-[#49424A]">{title}</h3>
        {isBeta && (
          <span className="px-2 py-1 text-xs text-white bg-secondary rounded-full fixed right-2 top-2">
            BETA
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-600">{description}</p>
      <button
        onClick={onClick}
        className="mt-auto text-secondary font-bold text-sm hover:underline"
      >
        {t("start")}
      </button>
    </div>
  );
}
