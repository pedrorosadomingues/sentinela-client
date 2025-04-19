/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { TYPES_GARMENT } from "@/constants/options";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import ToolInfo from "@/components/molecules/ToolInfo";
import { UseFormSetValue } from "react-hook-form";
import { FormValues } from "@/interfaces";

interface TypeButtonsProps {
  selectedType: string;
  setValue: UseFormSetValue<FormValues>;
}

export default function TypeButtons({
  selectedType,
  setValue,
}: TypeButtonsProps) {
  const text = useTranslations("type_buttons");

  return (
    <div className="flex flex-col gap-1 w-full dt-eleventh-step">
      <label className="text-sm font-medium text-gray-600">
        {text("type")}{" "}
        <ToolInfo
          title={text("type")}
          text={text("tooltip")}
          href="https://academy.arch.redraw.pro/"
        />
      </label>

      <div className="w-full flex gap-2">
        {TYPES_GARMENT.map((type) => (
          <Button
            key={type.value}
            onPress={() => setValue("garment_photo_type", type.value)}
            variant={selectedType === type.value ? "solid" : "bordered"}
            color={"secondary"}
            className="w-full text-sm"
            radius="sm"
            size="lg"
          >
            {/* @ts-ignore */}
            {text(`${type.value}`)}
          </Button>
        ))}
      </div>
    </div>
  );
}
