"use client";

//import { useTranslations } from "next-intl";
import React, { useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import GlobeAnimation from "@/assets/animations/globe.json";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Banner() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const text = useTranslations("root_banner");

  return (
    <aside className="base-blur h-screen w-full relative hidden lg:flex items-center justify-center overflow-hidden">
      <LanguageSwitcher />
      <div className="h-full w-full relative">
        <span className="right-blur"></span>
        <span className="bottom-blur"></span>
        <span className="top-blur"></span>
      </div>
      <article className="absolute w-full h-full z-10 flex flex-col items-center justify-center gap-8">
        <motion.section
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 2,
          }}
          className="flex flex-col items-center justify-center w-1/2 h-1/2"
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
            {text("main_title")}
          </h1>
          <p className="text-white text-base xl:text-lg w-3/4 mx-auto">
            {text("sub_title")}
          </p>
        </div>
      </article>
    </aside>
  );
}
