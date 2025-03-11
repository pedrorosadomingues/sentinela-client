"use client";

import React, { useState } from "react";
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
} from "@heroui/react";
import { cn } from "@heroui/react";
import { FrequencyEnum } from "./pricing";
import { frequencies, tiers } from "./pricing";
import { StarOutline } from "@mui/icons-material";

export default function AvailablePlans() {
  const [selectedFrequency, setSelectedFrequency] = useState(
    frequencies[0]
  );

  const onFrequencyChange = (selectedKey: React.Key) => {
    const frequencyIndex = frequencies.findIndex((f) => f.key === selectedKey);

    setSelectedFrequency(frequencies[frequencyIndex]);
  };

  return (
    <>
      <div className="flex max-w-xl flex-col text-center">
        <h2 className="font-medium text-secondary">Pricing</h2>
        <h1 className="text-4xl font-medium tracking-tight">
          Get unlimited access.
        </h1>
        <Spacer y={4} />
        <h2 className="text-large text-default-500">
          Discover the ideal plan, beginning at under $2 per week.
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
        <Tab key={FrequencyEnum.Quarterly} title="Pay Quarterly" />
      </Tabs>
      <Spacer y={12} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.key}
            className={cn("relative p-3", {
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
              <Button
                fullWidth
                as={Link}
                className={cn({
                  "bg-secondary-foreground font-medium text-secondary shadow-sm shadow-default-500/50":
                    tier.mostPopular,
                })}
                color={tier.buttonColor}
                href={tier.href}
                variant={tier.buttonVariant}
              >
                {tier.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Spacer y={12} />
      
      <div className="flex py-2">
        <p className="text-default-400">
          Are you an open source developer?&nbsp;
          <Link color="foreground" href="#" underline="always">
            Get a discount
          </Link>
        </p>
      </div>
    </>
  );
}
