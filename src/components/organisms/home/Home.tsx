/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import HistoryIcon from "@mui/icons-material/History";
import { useImageFunctionStore, useMainStore } from "@/zustand-stores";
import { useTranslations } from "next-intl";
import ConfirmationModal from "@/components/organisms/ConfirmationModal";
import Banner from "./Banner";
import Card from "@/components/molecules/MainOptionCard";
import {
  ImageFunctionName,
  ImageFunctionProps,
} from "@/interfaces/image-function";
import VestiqLoading from "../VestiqLoading";
import { ICON_MAPPING } from "@/constants";

export default function Home(): JSX.Element {
  const { imageFunctions, isFetching } = useImageFunctionStore();

  const { setMainControl } = useMainStore();

  const t = useTranslations("home");

  return (
    <main className="w-full grid grid-cols-1 gap-8 3xl:max-w-8xl mx-auto">
      {isFetching ? (
        <VestiqLoading />
      ) : (
        <>
          <Banner />
          <div className="w-full grid gap-4 xs:grid-cols-2 sm:grid-cols-[repeat(3,1fr)] md:grid-cols-[repeat(4,1fr)]">
            <div
              onClick={() => setMainControl(t("my_generations"))}
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
                title={func.title}
                description={func.description}
                isBeta={func.is_beta}
                onClick={() => setMainControl(func.title)}
                icon={ICON_MAPPING[func.name as ImageFunctionName]("large")}
              />
            ))}
            <ConfirmationModal />
          </div>
        </>
      )}
    </main>
  );
}
