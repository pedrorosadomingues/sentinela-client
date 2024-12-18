import React from "react";
import { CATEGORIES_GARMENT } from "@/constants/options";
import { useTranslations } from "next-intl";

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
    <div className="mb-5">
      <label>{text("category")}</label>
      <div className="flex gap-3 bg-secondary p-[3px] rounded-[6px]">
        {CATEGORIES_GARMENT.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => setFieldValue("category", category.value)}
            className={`text-[14px] h-[42px] p-[2px] ${
              selectedCategory === category.value
                ? "bg-white text-secondary "
                : "bg-secondary text-white"
            }`}
            style={{ borderRadius: "6px" }}
          >
            {text(`categories.${category.value}`)}
          </button>
        ))}
      </div>

      <style jsx>{`
        label {
          font-size: 0.875rem;
        }
        button {
          border-radius: 15px;
          transition: background-color 0.2s, color 0.2s;
        }
      `}</style>
    </div>
  );
}
