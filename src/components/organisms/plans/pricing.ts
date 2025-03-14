import { Plan } from "@/interfaces";
import { usePlanStore, useUserStore } from "@/stores";
import type { ButtonProps } from "@heroui/react";

export enum FrequencyEnum {
  Yearly = "yearly",
  Monthly = "monthly",
}

export enum TiersEnum {
  Free = "free-trial",
  Basic = "basic",
  Expert = "expert",
  Courtesy = "courtesy",
  Business = "business",
}

export type Frequency = {
  key: FrequencyEnum;
  label: string;
  priceSuffix: string;
};

export type Tier = {
  id: number;
  key: TiersEnum;
  title: string;
  price:
    | {
        [FrequencyEnum.Yearly]: string;
        [FrequencyEnum.Monthly]: string;
      }
    | string;
  priceSuffix?: string;
  href: string;
  description?: string;
  mostPopular?: boolean;
  featured?: boolean;
  features?: string[];
  buttonText: string;
  buttonColor?: ButtonProps["color"];
  buttonVariant: ButtonProps["variant"];
  isRecommended?: boolean;
  isFree?: boolean;
  isCurrentPlan?: boolean;
  plan: Plan;
};

export const frequencies: Array<Frequency> = [
  { key: FrequencyEnum.Yearly, label: "Pay Yearly", priceSuffix: "per year" },
  {
    key: FrequencyEnum.Monthly,
    label: "Pay monthly",
    priceSuffix: "per month",
  },
];

export const tiers = () => {
  const { plans } = usePlanStore.getState();
  const { user } = useUserStore.getState();

  return plans?.map((plan) => {
    const isRecommended = plan.key === "expert";
    const isFree = plan.key === "free-trial";
    const isCurrentPlan = user?.plan_id === plan.id;
    const price = String(plan.price_br).replace(".", ",");
    const buttonProps = {
      buttonText: isCurrentPlan
        ? "Current plan"
        : isFree
        ? "Join for free"
        : `Get ${plan.name}`,
      buttonColor: isFree || isCurrentPlan ? "default" : "secondary",
      buttonVariant: isFree || isCurrentPlan ? "flat" : "solid",
    };

    return {
      id: plan.id,
      key: plan.key as TiersEnum,
      title: plan.name,
      price: {
        [FrequencyEnum.Yearly]: plan.period === "yearly" ? `R$${price}` : "",
        [FrequencyEnum.Monthly]: plan.period === "monthly" ? `R$${price}` : "",
      },
      priceSuffix: plan.period === "yearly" ? "per year" : "per month",
      href: "#",
      featured: plan.name.toLowerCase().includes("team"),
      mostPopular: isRecommended,
      description: `Includes ${plan.available_resources.length} features with ${plan.storage_limit} GB storage.`,
      features: [
        ...plan.available_resources,
        `${plan.storage_limit} GB of storage`,
        `${plan.coins} coins`,
      ],
      ...buttonProps,
      isRecommended,
      isFree,
      isCurrentPlan,
      plan,
    } as Tier;
  });
};
