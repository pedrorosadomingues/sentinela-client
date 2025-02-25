"use client";

import React, { useRef } from "react";
import VestiqLogo from "../../atoms/VestiqLogo";
import { useTranslations } from "next-intl";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import GlobeAnimation from "@/assets/animations/globe.json";
import { motion } from "framer-motion";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("root_banner");
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  return (
    <div className="relative flex h-full min-h-screen w-full">
      <div className="absolute left-2 top-5 lg:left-5">
        <VestiqLogo className="w-16 lg:w-20" />
      </div>

      <div className="flex w-full items-center justify-center bg-background lg:w-1/2">
        {children}
      </div>

      {/* Right side */}
      <div className="bg-secondary relative hidden w-1/2 flex-col items-center justify-center rounded-l-medium p-10 shadow-small lg:flex">
        <motion.section
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 2,
          }}
          className="flex flex-col items-center justify-center w-1/2 h-1/2 mb-12"
        >
          <Lottie
            lottieRef={lottieRef}
            animationData={GlobeAnimation}
            className="w-full"
            aria-labelledby="use lottie animation"
          />
        </motion.section>
        <div className="flex flex-col gap-2 w-3/4 xl:w-[700px] text-center">
          <h1 className="text-white font-bold text-2xl xl:text-4xl">
            {t("main_title")}
          </h1>
          <p className="text-white text-base xl:text-lg w-3/4 mx-auto">
            {t("sub_title")}
          </p>
        </div>
      </div>
    </div>
  );
}
