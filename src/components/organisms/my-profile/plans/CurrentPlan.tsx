import { formatLocaleDate } from "@/utils/date";
import { useLocale, useTranslations } from "next-intl";

export default function CurrentPlan() {
  const t = useTranslations("profile.plan_and_billing");
  const locale = useLocale();

  const planStatusMap = {
    active: t("status.active"),
    canceled: t("status.canceled"),
    delayed: t("status.delayed"),
    refunded: t("status.refunded"),
    trialing: t("status.trialing"),
  };

  // Mocked currentPlan object
  const currentPlan = {
    title: "Plano Premium",
    locale: locale, // Assuming locale is set correctly
    price: 29.99, // Mock price
    is_annual: true, // Mocked as annual
  };

  // Mocked subscription object
  const subscription = {
    is_canceled: false,
    is_refunded: false,
    is_delayed: false,
    date_next_charge: "2023-12-01T00:00:00Z", // Mocked next charge date
  };

  return (
      <div className="w-full flex flex-col gap-1 shadow-xs !border-medium border-default-100 bg-transparent rounded-xl p-6">
        <div className="w-full flex items-center justify-between">
          <p className="text-sm 2xl:text-lg font-medium">
            {currentPlan?.title}
          </p>
          <p className="text-xs 2xl:text-sm bg-secondary px-2 py-1 text-white font-medium rounded-md">
            {subscription?.is_canceled
              ? planStatusMap.canceled
              : subscription?.is_refunded
              ? planStatusMap.refunded
              : subscription?.is_delayed
              ? planStatusMap.delayed
              : planStatusMap.active}
          </p>
        </div>
        <p className="text-sm md:text-lg font-semibold">
          {currentPlan?.locale === "en" ? "$" : "R$"}
          {currentPlan?.price}
          <span className="font-medium text-xs md:text-sm">
            /{currentPlan?.is_annual ? t("annual") : t("monthly")}
          </span>
        </p>
        <p className="text-xs 2xl:text-sm text-font-lighter">
          {`${t("next_billing", {
            date: formatLocaleDate(
              subscription?.date_next_charge as string,
              locale
            ),
          })}`}
        </p>
      </div>
  );
}
