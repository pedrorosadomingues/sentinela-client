import React from "react";
import { FN_OPTIONS } from "@/constants/options";

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
        {FN_OPTIONS.map((option) => (
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
};

export default FnButtons;
