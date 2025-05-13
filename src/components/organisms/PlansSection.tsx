/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { usePlanStore } from "@/stores";
import { useEffect } from "react";
import PaymentButton from "../atoms/buttons/PaymentButton";
import { useTranslations } from "next-intl";
import CheckIcon from "@mui/icons-material/Check";
import { CancelSubscriptionButton } from "../atoms/buttons/CancelSubscription";

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
              className={`flex flex-col w-[350px] rounded-tl-lg rounded-tr-lg shadow-md border border-gray-200 bg-white`}
            >
              <div
                className={`${
                  isRecommended
                    ? "bg-secondary text-white rounded-t-lg border-secondary"
                    : "bg-primary-100"
                } flex-col`}
              >
                <div className="flex items-center justify-between p-6">
                  <h2 className="text-2xl font-semibold font-primary">
                    {text(`plan_${plan.key}` as any)}
                  </h2>
                  {isRecommended && (
                    <span className="text-xs bg-tertiary text-white rounded-full px-2 py-1 ml-2">
                      {text("recommended")}
                    </span>
                  )}
                </div>

                <p
                  className={`text-[16px] mt-[-30px] ${
                    isRecommended ? "text-white" : "text-neutral-900"
                  } font-primary p-6`}
                >
                  {text(`${plan.key}_description` as any) ?? "No description"}
                </p>
              </div>
              <div className="p-6">
                <div className="mt-4 text-[48px] font-bold text-neutral-700 font-primary">
                  {price === 0 ? (
                    "Free"
                  ) : (
                    <span>
                      <span className="text-[25px]">R$</span>
                      {price.toFixed(2)}
                    </span>
                  )}{" "}
                  <span className="text-[14px] text-neutral-600 font-sans">
                    {text(plan.period as any)}
                  </span>
                </div>

                <PaymentButton plan={plan}>
                  <div className="font-sans">
                    {text(`get_${plan.key}` as any)}
                  </div>
                </PaymentButton>

                <ul className="mt-4 mb-6 text-sm text-gray-600 space-y-2">
                  <span className="font-semibold font-primary">
                    {text("features")}:
                  </span>
                  {plan.available_resources.map((resource) => (
                    <li key={resource}>
                      <CheckIcon className="text-tertiary3-500" />{" "}
                      <span className="text-neutral-900">
                        {text(resource as any)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      <div >
        <CancelSubscriptionButton />
      </div>
    </div>
  );
}
