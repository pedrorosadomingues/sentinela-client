import React from "react";
import { TYPES_GARMENT } from "@/constants/options";
import { useTranslations } from "next-intl";

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
    <div className="mb-5 flex flex-col">
      <label style={{ fontSize: "16px", marginBottom: "5px" }}>
        {text("type")}
      </label>
      <div className="flex gap-3 bg-secondary p-[3px] rounded-[6px]">
        {TYPES_GARMENT.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setFieldValue("garment_photo_type", type.value)}
            className={`text-[14px] h-[42px] p-[2px] ${
              selectedType === type.value
                ? "bg-white text-secondary "
                : "bg-secondary text-white"
            }`}
            style={{ borderRadius: "6px" }}
          >
            {text(`${type.value}`)}
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
