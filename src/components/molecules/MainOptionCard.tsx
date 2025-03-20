import { useTranslations } from "next-intl";
import React from "react";
import { Button as HeroButton } from "@nextui-org/react";

export default function Card({
  name,
  title,
  description,
  isBeta,
  onClick,
  icon,
  isLocked = false,
}: {
  name: string;
  title: string;
  description: string;
  isBeta: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  isLocked?: boolean;
}) {
  const t = useTranslations("home");

  return (
    <div className="h-full group min-h-56 relative">
      <div
        className={`wt-second-step h-full w-full
         absolute z-0 flex flex-col items-start justify-start gap-4 bg-white flex-1 border shadow-sm rounded-2xl select-none text-secondary`}
        onClick={isLocked ? undefined : onClick}
      >
        <div
          className={`w-full h-full flex flex-col items-start transition-all duration-300 absolute inset-0 p-4  ${
            isLocked ? "opacity-60 group-hover:blur-sm" : ""
          }`}
        >
          {isBeta && (
            <span className="bg-secondary rounded-full text-white text-xs absolute px-2 py-1 right-2 top-2">
              BETA
            </span>
          )}

          <div className="space-y-2">
            {icon}
            <h3 className="text-[#49424A] text-lg font-semibold">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>

          <button
            onClick={isLocked ? undefined : onClick}
            className={`mt-auto ${
              name === "dress-model" && "wt-third-step"
            } text-secondary font-bold text-sm hover:underline ${
              isLocked ? "opacity-50" : ""
            }`}
          >
            {t("start")}
          </button>
        </div>

        {isLocked && (
          <div className="p-2 absolute group-hover:block hidden inset-0 z-1">
            <div className="flex flex-col bg-gradient-to-r h-full justify-between p-4 rounded-2xl shadow-xl w-full animate-appearance-in from-slate-200/50 items-center max-w-md mx-auto select-none to-gray-300/50">
              <div className="bg-white h-3 rounded-full w-3 absolute left-4 opacity-60 top-4"></div>
              <div className="bg-white h-3 rounded-full w-3 absolute opacity-60 right-4 top-4"></div>
              <div className="bg-white h-3 rounded-full w-3 absolute bottom-4 left-4 opacity-60"></div>
              <div className="bg-white h-3 rounded-full w-3 absolute bottom-4 opacity-60 right-4"></div>

              <div className="flex justify-center items-center">
                <div className="bg-secondary p-3 rounded-lg">
                  <svg
                    className="h-6 text-white w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2 items-center">
                <h2 className="text-center text-default-700 text-lg font-medium">
                  Upgrade to unlock feature
                </h2>
                <p className="text-center text-gray-400 text-sm">
                  Unleash the power of AI to increase your engagement rate
                </p>
              </div>

              <HeroButton
                as="a"
                href="/main/profile?view=plans"
                className="w-full"
                radius="sm"
                color="secondary"
              >
                See pricing plans
              </HeroButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
