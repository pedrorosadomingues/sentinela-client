import {
  ModelCustomizationsProps,
  useCreateModelStore,
} from "@/zustand-stores/createModelStore";
import React from "react";
import { SliderSelector } from "../../SliderSelector";

export function Shape() {
  const { selectedModel, selectedCustomizations, setSelectedCustomizations } =
    useCreateModelStore();
  const isMaleGender = selectedModel === "model-1";

  const marks = [
    {
      value: 0,
      label: "Slim",
    },
    {
      value: 1,
      label: "Athletic",
    },
    {
      value: 2,
      label: "Muscular",
    },
    {
      value: 3,
      label: "Plus Size",
    },
  ];

  const handleSelectShape = (shape: number) => {
    const value = marks[shape].label;

    setSelectedCustomizations({
      ...selectedCustomizations,
      bodyType: value as ModelCustomizationsProps["bodyType"],
    });
  };

  return (
    <SliderSelector
      label="shape"
      value={selectedCustomizations?.bodyType || marks[2].label}
      onChange={handleSelectShape}
      marks={marks}
      iconStartPath={
        !isMaleGender
          ? "/icons/model-generator/female_shape_min.svg"
          : "/icons/model-generator/male_shape_min.svg"
      }
      iconEndPath={
        !isMaleGender
          ? "/icons/model-generator/female_shape_max.svg"
          : "/icons/model-generator/male_shape_max.svg"
      }
    />
  );
}
