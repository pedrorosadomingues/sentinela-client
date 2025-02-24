/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import DressTourProvider from "../organisms/tours/providers/DressTourProvider";
import DressModel from "../organisms/functions/DressModel";
import ImageFromText from "../organisms/functions/ImageFromText";
import RenderTraces from "../organisms/functions/RenderTraces";
import { useImageFunctionStore } from "@/stores";
import { notFound } from "next/navigation";
import VestiqLoading from "../organisms/VestiqLoading";

export default function Functions({ fn }: { fn: string }) {
  const { imageFunctions, isFetching } = useImageFunctionStore();

  const availableFunctions = imageFunctions?.map((fn) => fn.name as string);

  if (!availableFunctions.includes(fn)) {
    return notFound();
  }

  if (isFetching) {
    return <VestiqLoading />;
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
