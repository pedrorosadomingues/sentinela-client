import React from "react";
import { TYPES_GARMENT } from "@/constants/options";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import { InfoOutlined } from "@mui/icons-material";

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
        {text("type")} <InfoOutlined fontSize="small" />
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
            {text(`${type.value}`)}
          </Button>
        ))}
      </div>
    </div>
  );
}
