/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import DressTourProvider from "../organisms/tours/providers/DressTourProvider";
import DressModel from "../organisms/functions/DressModel";
import ImageFromText from "../organisms/functions/ImageFromText";
import RenderTraces from "../organisms/functions/RenderTraces";
import { useUserStore } from "@/stores";
//import { notFound } from "next/navigation";

export default function Functions({ fn }: { fn: string }) {
  const { user } = useUserStore();

  const availableFunctions = Array.isArray(user?.plan?.available_resources)
    ? user.plan.available_resources.map((fn) => fn as string)
    : [];

  if (!availableFunctions.includes(fn)) {
    return `Upgrade your plan to access this feature`;  
  }

  return (
    <>
      {fn === "dress-model" ? (
        <DressTourProvider>
          <DressModel />
        </DressTourProvider>
      ) : fn === "txt2img" ? (
        <ImageFromText />
      ) : fn === "render-traces" ? (
        <RenderTraces />
      ) : null}
    </>
  );
}
