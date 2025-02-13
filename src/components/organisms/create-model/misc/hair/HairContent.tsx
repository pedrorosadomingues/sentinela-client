import {
  ModelCustomizationsProps,
  useCreateModelStore,
} from "@/zustand-stores/createModelStore";
import React from "react";
import { Gallery } from "../Gallery";
import { ColorSelector } from "../ColorSelector";

export default function HairContent() {
  const { selectedModel, selectedCustomizations, setSelectedCustomizations } =
    useCreateModelStore();
  const selectedGender = selectedModel === "model-1" ? "male" : "female";

  const hairStyle = [
    "short",
    "long",
    "braided",
    "straight",
    "curly",
    "afro",
    "black_power",
    "shaved",
  ];
  const hairColors = [
    "black",
    "brown",
    "blonde",
    "red",
    "gray",
    "green",
    "blue",
    "colored",
  ];

  return (
    <div className="space-y-6">
      <Gallery
        items={hairStyle}
        selectedItem={selectedCustomizations?.hairStyle as string}
        onSelectItem={(style) =>
          setSelectedCustomizations({
            ...selectedCustomizations,
            hairStyle: style as ModelCustomizationsProps["hairStyle"],
          })
        }
        imagePath="/images/model-generator"
        imageSuffix="hair_"
        gender={selectedGender}
      />

      <ColorSelector
        colors={hairColors}
        selectedColor={selectedCustomizations?.hairColor as string}
        onSelectColor={(color) =>
          setSelectedCustomizations({
            ...selectedCustomizations,
            hairColor: color as ModelCustomizationsProps["hairColor"],
          })
        }
      />
    </div>
  );
}
