import React from "react";
import { categories } from "@/constants/options";

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
  return (
    <div className="mb-5">
      <label>Category</label>
      <div className="flex gap-3">
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => setFieldValue("category", category.value)}
            className={`p-2 ${
              selectedCategory === category.value
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
