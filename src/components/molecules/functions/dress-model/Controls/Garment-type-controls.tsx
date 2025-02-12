/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { TYPES_GARMENT } from "@/constants/options";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import ToolInfo from "@/components/atoms/ToolInfo";

interface TypeButtonsProps {
  selectedType: string;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
}

export default function TypeButtons({
  selectedType,
  setFieldValue,
}: TypeButtonsProps) {
  const text = useTranslations("type_buttons");

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-600">
        {text("type")}{" "}
        <ToolInfo
          title="lorem ipsum dolor"
          text="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
          video="https://redrawacademy.s3.sa-east-1.amazonaws.com/videos/tutorial/suggestions.mp4"
          href="https://academy.arch.redraw.pro/"
        />
      </label>

      <div className="w-full flex gap-2">
        {TYPES_GARMENT.map((type) => (
          <Button
            key={type.value}
            onPress={() => setFieldValue("garment_photo_type", type.value)}
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
