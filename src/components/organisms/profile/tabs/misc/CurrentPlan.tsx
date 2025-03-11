import { useUserStore } from "@/stores/userStore";
import { formatLocaleDate } from "@/utils/date";
import { useLocale, useTranslations } from "next-intl";

export default function CurrentPlan() {
  const t = useTranslations("profile.plan_and_billing");
  const { subscription, currentPlan } = useUserStore();
  const locale = useLocale();

  const planStatusMap = {
    active: t("status.active"),
    canceled: t("status.canceled"),
    delayed: t("status.delayed"),
    refunded: t("status.refunded"),
    trialing: t("status.trialing"),
  };

  return (
    <div className="w-full flex flex-col gap-1 border rounded-md p-4">
      <div className="w-full flex items-center justify-between">
        <p className="text-sm 2xl:text-lg font-medium">{currentPlan?.title}</p>
        <p className="text-xs 2xl:text-sm">
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
          date: formatLocaleDate(subscription?.date_next_charge as string, locale),
        })}`}
      </p>
    </div>
  );
}
