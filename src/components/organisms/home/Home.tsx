/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import HistoryIcon from "@mui/icons-material/History";
import { useFnStore, useUserStore } from "@/stores";
import { useTranslations } from "next-intl";
import ConfirmationModal from "@/components/organisms/ConfirmationModal";
import Banner from "./Banner";
import Card from "@/components/molecules/MainOptionCard";
import {
  ImageFunctionName,
  ImageFunctionProps,
} from "@/interfaces/image-function";
import { ICON_MAPPING } from "@/constants";
import WelcomeTourModal from "../tours/welcome/WelcomeTourModal";
import { useWelcomeTour } from "@/hooks/useWelcomeTour";
import { useRouter } from "next/navigation";

export default function Home(): JSX.Element {
  const t = useTranslations("home");
  const { imageFunctions } = useFnStore();
  const { user } = useUserStore();
  const availableFns = Array.isArray(user?.plan?.available_resources)
  ? user.plan.available_resources.map((fn) => fn as string)
  : [];
  const router = useRouter();
  const { isOpen: isTourOpen, hasSeenWelcomeTour, goToDressModelStep } = useWelcomeTour();
  const showHomeTour = !hasSeenWelcomeTour();

  return (
    <main className="flex flex-col w-full 3xl:max-w-8xl gap-8 mx-auto">
      {showHomeTour && <WelcomeTourModal />}
      <Banner />
      <div className="grid h-full w-full gap-4 md:grid-cols-[repeat(4,1fr)] mt-4 sm:grid-cols-[repeat(3,1fr)] wt-first-step xs:grid-cols-2">
        <div
          onClick={() => router.push("/main/generations?category=results")}
          className="flex flex-1 flex-col bg-white border justify-center p-4 rounded-2xl shadow-sm text-secondary gap-2 items-center relative select-none"
        >
          <HistoryIcon
            className="bg-secondary p-2 rounded-full text-[#FFFFFF] text-2xl"
            style={{ width: "80px", height: "80px", paddingRight: "10px" }}
          />
          <button className="text-[#49424A] text-sm font-bold hover:underline">
            {t("access_generations")}
          </button>
        </div>
        {imageFunctions?.map((func: ImageFunctionProps) => (
          <Card
            key={func.id}
            name={func.name}
            title={func.title}
            description={func.description}
            isBeta={func.is_beta}
            isLocked={!availableFns.includes(func.name)}
            onClick={() => {
              if (func.name === "dress-model") {
                if (isTourOpen) {
                  goToDressModelStep();
                } else {
                  router.push(`/main/fns/${func.name}`);
                }
              } else {
                router.push(`/main/fns/${func.name}`);
              }
            }}
            icon={ICON_MAPPING[func.name as ImageFunctionName]("large")}
          />
        ))}
        <ConfirmationModal />
      </div>
    </main>
  );
}
