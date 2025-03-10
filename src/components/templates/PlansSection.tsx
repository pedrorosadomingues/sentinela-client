/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { usePlanStore } from "@/stores";
import { useEffect } from "react";
import PaymentButton from "../atoms/PaymentButton";
import { useTranslations } from "next-intl";
import CheckIcon from "@mui/icons-material/Check";

export default function PlansSection(): JSX.Element {
  const { plans, getPlans } = usePlanStore();
  const text = useTranslations("plans_section");
  useEffect(() => {
    getPlans();
  }, [getPlans]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {plans?.map((plan) => {
          const isRecommended = plan.key === "expert";
          const price = Number(plan.price_br);

          return (
            <div
              key={plan.stripe_price_id}
              className={`flex flex-col p-6 w-full md:w-72 rounded-lg shadow-md border 
                ${
                  isRecommended
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white"
                }
              `}
            >
              {isRecommended && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full w-min mb-2">
                  {text("recommended")}
                </span>
              )}

              <h2 className="text-2xl font-semibold">
                {text(`plan_${plan.key}` as any)}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {text(`${plan.key}_description` as any) ?? "No description"}
              </p>

              <div className="mt-4 text-4xl font-bold">
                {price === 0 ? "Free" : `$${price.toFixed(2)}`}{" "}
                <span className="text-sm text-gray-500">
                  {text(plan.period as any)}
                </span>
              </div>

              <PaymentButton plan={plan}>
                <div>
                  {price === 0
                    ? "Join for free"
                    : text(`get_${plan.key}` as any)}
                </div>
              </PaymentButton>

              <ul className="mt-4 mb-6 text-sm text-gray-600 space-y-2">
                <span className="font-semibold">{text("features")}:</span>
                {plan.available_resources.map((resource) => (
                  <li key={resource}>
                    <CheckIcon className="text-[#05B8EFFF]" />{" "}
                    {text(resource as any)}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
