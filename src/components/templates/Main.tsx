/* eslint-disable @next/next/no-img-element */
/* components/templates/Studio.tsx */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../organisms/Header";
import Sidebar from "../organisms/Sidebar";
import DressModel from "@/components/organisms/functions/DressModel";
import MyGenerations from "../organisms/My-Generations";
import Home from "@/components/organisms/Home";
import { useMainStore } from "@/zustand-stores/mainStore";
import RenderTraces from "../organisms/functions/RenderTraces";
import ImageFromText from "../organisms/functions/ImageFromText";
import MyProfile from "./My-Profile";
import { useTranslations } from "next-intl";

export default function Main(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mainControl, setMainControl } = useMainStore();
  const [isLoading, setIsLoading] = useState(true);
  const text = useTranslations("home");

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <img
          src="/icons/logo-vestiq.ico"
          alt="Loading"
          className="animate-spin-bounce w-24 h-24"
        />
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-screen flex justify-center w-full">
      <Header />
      <Sidebar />
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
      ) : (
        <div>Main</div>
      )}
    </div>
  );
}
