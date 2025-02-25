import {
  ModelCustomizationsProps,
  useCreateModelStore,
} from "@/stores/createModelStore";
import React from "react";
import { Gallery } from "../Gallery";
import { ColorSelector } from "../ColorSelector";

export default function FacialHairContent() {
  const { selectedCustomizations, setSelectedCustomizations } =
    useCreateModelStore();

  const facialHairStyle = ["full_beard", "goatee", "mustache", "no_beard"];
  const facialHairColors = [
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
        items={facialHairStyle as string[]}
        selectedItem={selectedCustomizations?.facialHair as string}
        onSelectItem={(style) =>
          setSelectedCustomizations({
            ...selectedCustomizations,
            facialHair: style as ModelCustomizationsProps["facialHair"],
          })
        }
        imagePath="/images/model-generator"
        imageSuffix="facial_hair_"
        gender="male"
      />

      <ColorSelector
        colors={facialHairColors}
        selectedColor={selectedCustomizations?.facialHairColor as string}
        onSelectColor={(color) =>
          setSelectedCustomizations({
            ...selectedCustomizations,
            facialHairColor:
              color as ModelCustomizationsProps["facialHairColor"],
          })
        }
      />
    </div>
  );
}
