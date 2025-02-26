/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import DressTourProvider from "../organisms/tours/providers/DressTourProvider";
import DressModel from "../organisms/functions/DressModel";
import ImageFromText from "../organisms/functions/ImageFromText";
import RenderTraces from "../organisms/functions/RenderTraces";
import { useFnStore } from "@/stores";
import { notFound } from "next/navigation";

export default function Functions({ fn }: { fn: string }) {
  const { imageFunctions } = useFnStore();

  const availableFunctions = imageFunctions?.map((fn) => fn.name as string);

  if (!availableFunctions.includes(fn)) {
    return notFound();
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
