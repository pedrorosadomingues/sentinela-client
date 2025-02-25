/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import HistoryIcon from "@mui/icons-material/History";
import {
  useImageFunctionStore,
  useUserStore,
} from "@/stores";
import { useLocale, useTranslations } from "next-intl";
import ConfirmationModal from "@/components/organisms/ConfirmationModal";
import Banner from "./Banner";
import Card from "@/components/molecules/MainOptionCard";
import {
  ImageFunctionName,
  ImageFunctionProps,
} from "@/interfaces/image-function";
import VestiqLoading from "../VestiqLoading";
import { ICON_MAPPING } from "@/constants";
import WelcomeTourModal from "../tours/welcome/WelcomeTourModal";
import { useTour } from "@reactour/tour";
import { axiosClient } from "@/lib/axios/axiosClient";
import { useRouter } from "next/navigation";

export default function Home(): JSX.Element {
  const t = useTranslations("home");
  const { imageFunctions, isFetching, getImageFunctions } =
    useImageFunctionStore();
  const { setCurrentStep, currentStep, isOpen: isTourOpen } = useTour();
  const { user, getUser } = useUserStore();
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    getImageFunctions(locale as string);
  }, []);

  const handleUpdateStep = () => {
    const body = {
      user_id: user?.id,
      tour_id: 1, // Dress Model Tour ID
    };

    axiosClient
      .post("/user/user_tour", body)
      .then(async () => {
        await getUser(user?.id as number);

        if (currentStep === 0) {
          setCurrentStep(currentStep + 1);
        }

        router.push(`/main/fns/dress-model`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (isFetching) {
    return <VestiqLoading />;
  }

  return (
    <main className="w-full grid grid-cols-1 gap-8 3xl:max-w-8xl mx-auto">
      <WelcomeTourModal />
      <Banner />
      <div className="wt-first-step w-full grid gap-4 xs:grid-cols-2 sm:grid-cols-[repeat(3,1fr)] md:grid-cols-[repeat(4,1fr)]">
        <div
          onClick={() => router.push("/main/generations?category=results")}
          className="relative flex flex-col items-center justify-center gap-2 bg-white flex-1 border shadow-sm rounded-2xl p-4 select-none text-secondary"
        >
          <HistoryIcon
            className="text-2xl text-[#FFFFFF] bg-secondary rounded-full p-2"
            style={{ width: "80px", height: "80px", paddingRight: "10px" }}
          />
          <button className="text-[#49424A] font-bold text-sm hover:underline ">
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
            onClick={() => {
              if (func.name === "dress-model") {
                if (isTourOpen) {
                  handleUpdateStep();
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
