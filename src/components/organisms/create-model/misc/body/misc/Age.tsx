import { useCreateModelStore } from "@/stores/createModelStore";
import React from "react";
import { SliderSelector } from "../../SliderSelector";

export function Age() {
  const { selectedModel, selectedCustomizations, setSelectedCustomizations } =
    useCreateModelStore();
  const isMaleGender = selectedModel === "model-1";

  const marks = [
    { value: 0, label: "child" },
    { value: 1, label: "teen" },
    { value: 2, label: "adult" },
    { value: 3, label: "elderly" },
  ];

  const handleSelectAge = (value: number) => {
    const selectedValue = marks[value].label;

    setSelectedCustomizations({
      ...selectedCustomizations,
      age: selectedValue as "child" | "teen" | "adult" | "elderly",
    });
  };

  return (
    <SliderSelector
      label="age"
      value={selectedCustomizations?.age || marks[2].label}
      onChange={handleSelectAge}
      marks={marks}
      iconStartPath={
        !isMaleGender
          ? "/icons/model-generator/female_child.svg"
          : "/icons/model-generator/male_child.svg"
      }
      iconEndPath={
        !isMaleGender
          ? "/icons/model-generator/female_old.svg"
          : "/icons/model-generator/male_old.svg"
      }
    />
  );
}
