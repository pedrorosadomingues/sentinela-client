/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import DressModel from "../organisms/functions/DressModel";
import ImageFromText from "../organisms/functions/ImageFromText";
import RenderTraces from "../organisms/functions/RenderTraces";
import { useUserStore } from "@/stores";
import DressModelTourProvider from "../organisms/tours/providers/DressTourProvider";
//import { notFound } from "next/navigation";

export default function Functions({ fn }: { fn: string }) {
  const { user } = useUserStore();

  const availableFunctions = Array.isArray(user?.plan?.available_resources)
    ? user.plan.available_resources.map((fn) => fn as string)
    : [];

  return (
    <>
      {fn === "dress-model" ? (
        <DressModelTourProvider>
          <DressModel />
        </DressModelTourProvider>
      ) : fn === "txt2img" ? (
        <ImageFromText />
      ) : fn === "render-traces" ? (
        <RenderTraces />
      ) : null}
    </>
  );
}
