/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatLocaleDate } from "@/utils/date";
import { useLocale, useTranslations } from "next-intl";
import { useUserStore } from "@/stores";

export default function CurrentPlan() {
  const { user } = useUserStore();
  const t = useTranslations("profile.plan_and_billing");
  const t2 = useTranslations("my-profile.plans");
  const locale = useLocale();

  return (
    <div className="w-full flex flex-col gap-1 shadow-xs !border-medium border-default-100 bg-transparent rounded-xl p-6">
      <div className="w-full flex items-center justify-between">
        <p className="text-sm 2xl:text-lg font-medium">
          {t2(user?.plan.key as any)}
        </p>
        <p className="text-xs 2xl:text-sm bg-secondary px-2 py-1 text-white font-medium rounded-md">
          {user?.subscription?.stripe_status === "trialing"
            ? t("status.trialing")
            : user?.subscription?.stripe_status === "canceled"
            ? t("status.canceled")
            : user?.subscription?.stripe_status === "active"
            ? t("status.active")
            : user?.subscription?.stripe_status === "refunded"
            ? t("status.refunded")
            : user?.subscription?.stripe_status === "delayed"
            ? t("status.delayed")
            : user?.subscription?.stripe_status === "expired"
            ? t("status.canceled")
            : user?.subscription?.stripe_status === "pending"}
        </p>
      </div>
      <p className="text-sm md:text-lg font-semibold">
        {user?.plan.key !== "free-trial" && new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
        }).format(Number(user?.plan.price_br))}
        <span className="font-medium text-xs md:text-sm">
          {user?.plan.period === "yearly" ? `/${t("annual")}` : user?.plan.period === "monthly" && `/${t("monthly")}`}
        </span>
      </p>
      <p className="text-xs 2xl:text-sm text-font-lighter">
        {user?.plan.key !== "free-trial" ? `${t("next_billing", {
          date: formatLocaleDate(
            user?.subscription?.expires_at as string,
            locale
          ),
        })}` : t("current_plan_description", {
          expiration_date: formatLocaleDate(
            user?.subscription?.expires_at as string,
            locale
          ),
          plan: t2(user?.plan.key as any),
        })}
      </p>
    </div>
  );
}
