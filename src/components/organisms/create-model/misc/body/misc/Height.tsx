import {
  ModelCustomizationsProps,
  useCreateModelStore,
} from "@/zustand-stores/createModelStore";
import React from "react";
import { SliderSelector } from "../../SliderSelector";

export function Height() {
  const { selectedModel, selectedCustomizations, setSelectedCustomizations } =
    useCreateModelStore();
  const isMaleGender = selectedModel === "model-1";

  const marks = [
    { value: 0, label: "short" },
    { value: 1, label: "medium" },
    { value: 2, label: "tall" },
  ];

  const handleSelectHeight = (height: number) => {
    const value = marks[height].label;

    setSelectedCustomizations({
      ...selectedCustomizations,
      height: value as ModelCustomizationsProps["height"],
    });
  };

  return (
    <SliderSelector
      label="height"
      value={selectedCustomizations?.height || marks[1].label}
      onChange={handleSelectHeight}
      marks={marks}
      iconStartPath={
        !isMaleGender
          ? "/icons/model-generator/female_height_min.svg"
          : "/icons/model-generator/male_height_min.svg"
      }
      iconEndPath={
        !isMaleGender
          ? "/icons/model-generator/female_height_max.svg"
          : "/icons/model-generator/male_height_max.svg"
      }
    />
  );
}
