import React from "react";
import { fnOptions } from "@/constants/options";

interface FnButtonsProps {
  selectedFn: string;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
}

const FnButtons: React.FC<FnButtonsProps> = ({ selectedFn, setFieldValue }) => {
  return (
    <div className="mb-5">
      <label>Fn</label>
      <div className="flex gap-3">
        {fnOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              option.selectable && setFieldValue("fn", option.value)
            }
            className={`p-2 ${
              selectedFn === option.value
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            } ${!option.selectable && "opacity-50 cursor-not-allowed"}`}
            disabled={!option.selectable}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FnButtons;
