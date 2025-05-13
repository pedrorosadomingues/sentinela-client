/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
  Spacer,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { cn } from "@heroui/react";
import { FrequencyEnum } from "./pricing";
import { frequencies, tiers } from "./pricing";
import { StarOutline } from "@mui/icons-material";
import { usePlanStore } from "@/stores";
import PaymentButton from "@/components/atoms/buttons/PaymentButton";
import { Plan } from "@/interfaces";
import { CancelSubscriptionButton } from "@/components/atoms/buttons/CancelSubscription";

export default function AvailablePlans() {
  const { getPlans } = usePlanStore();
  const [selectedFrequency, setSelectedFrequency] = useState(frequencies[0]);
  const { isOpen, onOpenChange } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const availablePlans = tiers();

  const onFrequencyChange = (selectedKey: React.Key) => {
    const frequencyIndex = frequencies.findIndex((f) => f.key === selectedKey);

    setSelectedFrequency(frequencies[frequencyIndex]);
  };

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  return (
    <>
      <div className="flex max-w-xl flex-col text-center">
        <h2 className="font-medium text-secondary">Pricing</h2>
        <h1 className="text-4xl font-medium tracking-tight">
          Get unlimited access.
        </h1>
        <Spacer y={4} />
        <h2 className="text-large text-default-500">
          Unlock premium features for less than $19 a week—invest in your
          success today!
        </h2>
      </div>
      <Spacer y={8} />
      <Tabs
        classNames={{
          tab: "data-[hover-unselected=true]:opacity-90",
        }}
        radius="full"
        size="lg"
        onSelectionChange={onFrequencyChange}
      >
        <Tab
          key={FrequencyEnum.Yearly}
          aria-label="Pay Yearly"
          className="pr-1.5"
          title={
            <div className="flex items-center gap-2">
              <p>Pay Yearly</p>
              <Chip color="secondary">Save 25%</Chip>
            </div>
          }
        />
        <Tab key={FrequencyEnum.Monthly} title="Pay Monthly" />
      </Tabs>
      <Spacer y={12} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availablePlans?.map((tier) => (
          <Card
            key={tier.key}
            className={cn("relative p-3 z-0", {
              "overflow-visible bg-secondary shadow-2xl shadow-secondary/20":
                tier.mostPopular,
              "!border-medium border-default-100 bg-transparent lg:mt-12":
                !tier.mostPopular,
            })}
            shadow="none"
          >
            {tier.mostPopular ? (
              <Chip
                classNames={{
                  base: "absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary-foreground shadow-large border-medium border-secondary",
                  content: "font-medium text-secondary",
                }}
                color="secondary"
              >
                Most Popular
              </Chip>
            ) : null}
            <CardHeader className="flex flex-col items-start gap-2 pb-6">
              <h2
                className={cn("text-xl font-medium", {
                  "text-secondary-foreground": tier.mostPopular,
                })}
              >
                {tier.title}
              </h2>
              <p
                className={cn("text-medium text-default-500", {
                  "text-secondary-foreground/70": tier.mostPopular,
                })}
              >
                {tier.description}
              </p>
            </CardHeader>
            <Divider className="bg-secondary-foreground/20" />
            <CardBody className="justify-between">
              <div className="flex flex-col gap-8">
                <p className="flex items-baseline gap-1 pt-2">
                  <span
                    className={cn(
                      "inline bg-gradient-to-br from-foreground to-foreground-600 bg-clip-text text-4xl font-semibold leading-7 tracking-tight text-transparent",
                      {
                        "text-secondary-foreground": tier.mostPopular,
                      }
                    )}
                  >
                    {typeof tier.price === "string"
                      ? tier.price
                      : tier.price[selectedFrequency.key]}
                  </span>
                  {typeof tier.price !== "string" ? (
                    <span
                      className={cn("text-sm font-medium text-default-400", {
                        "text-primary-foreground/50": tier.mostPopular,
                      })}
                    >
                      /{selectedFrequency.priceSuffix}
                    </span>
                  ) : null}
                </p>
                <ul className="flex flex-col gap-2">
                  {tier.features?.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <StarOutline
                        className={
                          tier.mostPopular
                            ? "text-secondary-foreground"
                            : "text-default-500"
                        }
                      />
                      <p
                        className={cn("text-default-500", {
                          "text-primary-foreground/70": tier.mostPopular,
                        })}
                      >
                        {feature}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>
            <CardFooter>
              <PaymentButton plan={tier.plan}>{tier.buttonText}</PaymentButton>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Spacer y={12} />

      <div>
        <CancelSubscriptionButton />
      </div>
    </>
  );
}
