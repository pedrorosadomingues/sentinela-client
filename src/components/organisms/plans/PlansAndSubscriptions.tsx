"use client";

import React from "react";
import CurrentPlan from "./CurrentPlan";
import { useTranslations } from "next-intl";
import AvailablePlans from "./AvailablePlans";
import PlansSection from "@/components/organisms/PlansSection";

export default function PlansAndSubscriptions() {
  const t = useTranslations("profile.plan_and_billing");

  return (
    <main className="flex flex-col items-center space-y-8 max-w-5xl mx-auto mb-16">
      <section className="w-full flex flex-col gap-4 select-none">
        <h3 className="text-xl font-semibold">{t("current_plan")}</h3>
        <CurrentPlan />
      </section>
      <section className="w-full flex flex-col items-center gap-4 select-none">
        <AvailablePlans />
      </section>
      <PlansSection />
    </main>
  );
}
