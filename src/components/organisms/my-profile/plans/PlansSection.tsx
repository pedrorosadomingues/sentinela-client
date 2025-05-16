/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Spacer,
} from "@heroui/react";
import { StarOutline } from "@mui/icons-material";
import { cn } from "@heroui/react";
import PaymentButton from "@/components/atoms/buttons/PaymentButton";
import { useTranslations } from "next-intl";
import { usePlanStore, useUserStore } from "@/stores";

export default function PlansSection() {
  const { plans, getPlans } = usePlanStore();
  const { user } = useUserStore();
  const t = useTranslations("my-profile.plans");

  console.log("user:", user)

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex max-w-xl flex-col text-center mx-auto">
        <h2 className="font-medium text-secondary">{t("pricing_title")}</h2>
        <h1 className="text-4xl font-medium tracking-tight">
          {t("pricing_heading")}
        </h1>
        <Spacer y={4} />
        <h2 className="text-large text-default-500">
          {t("pricing_description")}
        </h2>
      </div>

      <Spacer y={12} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <Card
            key={plan.key}
            className={cn("relative p-3 z-0", {
              "overflow-visible bg-secondary shadow-2xl shadow-secondary/20":
                plan.key === "expert",
              "!border-medium border-default-100 bg-transparent lg:mt-12": !(
                plan.key === "expert"
              ),
            })}
            shadow="none"
          >
            {plan.key === "expert" && (
              <Chip
                classNames={{
                  base: "absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary-foreground shadow-large border-medium border-secondary",
                  content: "font-medium text-secondary",
                }}
                color="secondary"
              >
                {t("most_popular")}
              </Chip>
            )}

            <CardHeader className="flex flex-col items-start gap-2 pb-6">
              <h2
                className={cn("text-xl font-medium", {
                  "text-secondary-foreground": plan.key === "expert",
                })}
              >
                {t(plan.key as any)}
              </h2>
              <p
                className={cn("text-medium text-default-500", {
                  "text-secondary-foreground/70": plan.key === "expert",
                })}
              >
                {t("includes")} {plan.available_resources.length}{" "}
                {t("features")}
              </p>
            </CardHeader>

            <Divider className="bg-secondary-foreground/20" />

            <CardBody className="justify-between">
              <div className="flex flex-col gap-8">
                <p className="flex items-baseline gap-1 pt-2">
                  <span
                    className={cn(
                      "inline bg-gradient-to-br from-foreground to-foreground-600 bg-clip-text pb-[5px] text-[31px] font-semibold leading-7 tracking-tight text-transparent",
                      {
                        "text-secondary-foreground": plan.key === "expert",
                      }
                    )}
                  >
                    {plan.period === "yearly" &&
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                      }).format(Number(plan.price_br))}
                  </span>
                  <span
                    className={cn("text-sm font-medium text-default-400", {
                      "text-primary-foreground/50": plan.key === "expert",
                    })}
                  >
                    /{t("per_year")}
                  </span>
                </p>

                <ul className="flex flex-col gap-2">
                  {plan.available_resources.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <StarOutline
                        className={
                          plan.key === "expert"
                            ? "text-secondary-foreground"
                            : "text-default-500"
                        }
                      />
                      <p
                        className={cn("text-default-500", {
                          "text-primary-foreground/70": plan.key === "expert",
                        })}
                      >
                        {t(feature as any)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>

            <CardFooter>
              <PaymentButton plan={plan}>
                {user?.plan.id === plan.id
                  ? "Current plan"
                  : plan.key === "free-trial"
                  ? "Join for free"
                  : `Get ${plan.name}`}
              </PaymentButton>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
