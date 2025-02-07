/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* components/templates/Studio.tsx */
"use client";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../organisms/Header";
import Sidebar from "../organisms/Sidebar";
import DressModel from "@/components/organisms/functions/DressModel";
import MyGenerations from "../organisms/My-Generations";
import Home from "@/components/organisms/home/Home";
import {
  useMainStore,
  useImageFunctionStore,
  useGenerationStore,
} from "@/zustand-stores";
import RenderTraces from "../organisms/functions/RenderTraces";
import ImageFromText from "../organisms/functions/ImageFromText";
import MyProfile from "./My-Profile";
import VestiqLoading from "../organisms/VestiqLoading";
import PlansAndSubscriptions from "../organisms/plans/PlansAndSubscriptions";

export default function Main(): JSX.Element {
  const text = useTranslations("home");

  const router = useRouter();

  const searchParams = useSearchParams();

  const { mainControl, setMainControl } = useMainStore();

  const { getImageFunctions } = useImageFunctionStore();
  
  const { isFetching } = useGenerationStore();

  const [isLoading, setIsLoading] = useState(true);

  const locale = useLocale();

  useEffect(() => {
    getImageFunctions(locale as string);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setMainControl(tab);
    }
  }, [searchParams, setMainControl]);

  useEffect(() => {
    if (mainControl) {
      router.push(`?tab=${mainControl}`);
      setIsLoading(false);
    }
  }, [mainControl, router]);

  return (
    <div className="min-h-screen flex justify-center w-full">
      <Header />
      <Sidebar />
      {(isLoading || isFetching) && <VestiqLoading />}
      <main className="w-full md:ml-24 mt-20 px-4 md:px-0 md:pr-4">
        {mainControl === text("home") ? (
          <Home />
        ) : mainControl === text("dress-model") ? (
          <DressModel />
        ) : mainControl === text("my_generations") ? (
          <MyGenerations />
        ) : mainControl === text("txt2img") ? (
          <ImageFromText />
        ) : mainControl === text("render-traces") ? (
          <RenderTraces />
        ) : mainControl === text("my_profile") ? (
          <MyProfile />
        ) : mainControl === text("plans_and_subscriptions") ? (
          <PlansAndSubscriptions />
        ) : null}
      </main>
    </div>
  );
}
