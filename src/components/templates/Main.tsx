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

export default function Main(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mainControl, setMainControl } = useMainStore();
  const [isLoading, setIsLoading] = useState(true);
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
          src="/icons/logo-vestiq.png"
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
      {mainControl === "Home" ||
      mainControl === "Início" ||
      mainControl === "Inicio" ? (
        <Home />
      ) : mainControl === "Dress Model" ||
        mainControl === "Vestir Modelo" ||
        mainControl === "Vestir Modelo" ? (
        <DressModel />
      ) : mainControl === "My Generations" ||
        mainControl === "Minhas Gerações" ||
        mainControl === "Mis Generaciones" ? (
        <MyGenerations />
      ) : mainControl === "Image from Text" ||
        mainControl === "Imagem a partir de Texto" ||
        mainControl === "Imagen a partir de Texto" ? (
        <ImageFromText />
      ) : mainControl === "Render Traces" ||
        mainControl === "Renderizar Traços" ||
        mainControl === "Renderizar Trazos" ? (
        <RenderTraces />
      ) : (
        <div>Main</div>
      )}
    </div>
  );
}
