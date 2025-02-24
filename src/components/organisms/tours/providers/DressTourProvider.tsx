/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { TourProvider } from "@reactour/tour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Bubble from "../misc/Bubble";
import { CustomStepType, getDressModelTourSteps } from "@/constants/tours";
import { useDressModelStore } from "@/stores/dressModelStore";
import { useLocale } from "next-intl";

export default function DressTourProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleExitDressTour } = useDressModelStore();
  const locale = useLocale();
  const DRESS_MODEL_TOUR_STEPS = getDressModelTourSteps(locale);

  const disableBody = (target: Element | null) =>
    disableBodyScroll(target as Element);
  const enableBody = (target: Element | null) =>
    enableBodyScroll(target as Element);

  return (
    <TourProvider
      steps={DRESS_MODEL_TOUR_STEPS}
      scrollSmooth
      disableDotsNavigation
      disableKeyboardNavigation
      afterOpen={disableBody}
      inViewThreshold={{ x: 50, y: 50 }}
      beforeClose={(target) => {
        enableBody(target);
        handleExitDressTour();
      }}
      onClickHighlighted={(e) => {
        e.stopPropagation();
      }}
      disableInteraction={({ currentStep, steps }) =>
        (steps?.[currentStep] as CustomStepType)?.disableActions ?? false
      }
      styles={{
        popover: (base) => ({
          ...base,
          "--reactour-accent": "#000000",
          padding: "0",
          background: "transparent",
          borderRadius: 12,
        }),
        maskWrapper: (base) => ({ ...base, color: "#00000060" }),
        badge: (base) => ({ ...base, left: "auto", right: "-0.8125em" }),
        controls: (base) => ({ ...base, marginTop: 100 }),
        close: (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
      }}
      ContentComponent={(props) => (
        <Bubble {...props} steps={DRESS_MODEL_TOUR_STEPS as CustomStepType[]} />
      )}
    >
      {children}
    </TourProvider>
  );
}
