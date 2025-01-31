/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { CATEGORIES_GARMENT } from "@/constants/options";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import { InfoOutlined } from "@mui/icons-material";
interface CategoryButtonsProps {
  selectedCategory: string;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
}

export default function CategoryButtons({
  selectedCategory,
  setFieldValue,
}: CategoryButtonsProps) {
  const text = useTranslations("category_buttons");

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-600">
        {text("category")} <InfoOutlined fontSize="small" />
      </label>

      <div className="w-full flex gap-2">
        {CATEGORIES_GARMENT.map((category) => (
          <Button
            key={category.value}
            onPress={() => setFieldValue("category", category.value)}
            variant={selectedCategory === category.value ? "solid" : "bordered"}
            color={"secondary"}
            className="w-full text-sm h-24 aspect-square flex flex-col items-center justify-center gap-2"
            radius="sm"
            size="lg"
          >
            <span className="fill-white">{category.icon}</span>
            <span className="text-sm md:text-xs xl:text-sm">
              {/* @ts-ignore */}
              {text(`categories.${category.value}`)}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
