/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { TourProvider } from "@reactour/tour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Bubble from "../misc/Bubble";
import { CustomStepType, getWelcomeTourSteps } from "@/constants/tours";
import { useLocale } from "next-intl";
import { useWelcomeTour } from "@/hooks/useWelcomeTour";

export default function WelcomeTourProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const WELCOME_TOUR_STEPS = getWelcomeTourSteps(locale);
  const { handleSkipTour } = useWelcomeTour();

  const disableBody = (target: Element | null) =>
    disableBodyScroll(target as Element);
  const enableBody = (target: Element | null) =>
    enableBodyScroll(target as Element);

  return (
    <TourProvider
      steps={WELCOME_TOUR_STEPS}
      scrollSmooth
      // disableDotsNavigation
      // disableKeyboardNavigation
      afterOpen={disableBody}
      beforeClose={enableBody}
      onClickHighlighted={(e) => {
        e.stopPropagation();
      }}
      disableInteraction={({ currentStep, steps }) =>
        (steps?.[currentStep] as CustomStepType)?.disableActions ?? false
      }
      onClickClose={(e) => null}
      onClickMask={(e) => null}
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
        <Bubble 
          {...props} 
          steps={WELCOME_TOUR_STEPS as CustomStepType[]} 
          onSkip={handleSkipTour}
        />
      )}
    >
      {children}
    </TourProvider>
  );
}
