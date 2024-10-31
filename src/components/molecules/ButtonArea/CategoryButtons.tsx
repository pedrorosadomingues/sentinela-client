import React from "react";
import { CATEGORIES } from "@/constants/options";

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
        {CATEGORIES.map((category) => (
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
      <style jsx>{`
        label {
          font-size: 0.875rem;
        }
        button {
          border-radius: 50%;
          transition: background-color 0.2s, color 0.2s;
        }
      `}</style>
    </div>
  );
}
