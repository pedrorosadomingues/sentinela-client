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
    <div className="relative flex flex-col items-start justify-start gap-2 bg-white flex-1 border shadow-sm rounded-2xl p-4 select-none text-secondary">
      {isBeta && (
        <span className="px-2 py-1 text-xs text-white bg-secondary rounded-full absolute right-2 top-2">
          BETA
        </span>
      )}

      <div className="space-y-2">
        {icon}
        <h3 className="text-lg font-semibold text-[#49424A]">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <button
        onClick={onClick}
        className="mt-auto text-secondary font-bold text-sm hover:underline"
      >
        {t("start")}
      </button>
    </div>
  );
}
