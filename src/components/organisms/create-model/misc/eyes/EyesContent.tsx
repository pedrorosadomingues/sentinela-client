import {
  ModelCustomizationsProps,
  useCreateModelStore,
} from "@/stores/createModelStore";
import React from "react";
import { Gallery } from "../Gallery";
import { ColorSelector } from "../ColorSelector";

export default function EyesContent() {
  const { selectedCustomizations, setSelectedCustomizations } =
    useCreateModelStore();

  const eyeShapes = ["small", "medium", "large", "almond"];
  const eyeColors = ["blue", "green", "brown", "black", "gray"];

  return (
    <div className="space-y-6">
      <Gallery
        items={eyeShapes}
        selectedItem={selectedCustomizations?.eyeShape as string}
        onSelectItem={(style) =>
          setSelectedCustomizations({
            ...selectedCustomizations,
            eyeShape: style as ModelCustomizationsProps["eyeShape"],
          })
        }
        imagePath="/images/model-generator"
        imageSuffix="eyes_"
        imageType="png"
      />

      <ColorSelector
        colors={eyeColors}
        selectedColor={selectedCustomizations?.eyeColor as string}
        onSelectColor={(color) =>
          setSelectedCustomizations({
            ...selectedCustomizations,
            eyeColor: color as ModelCustomizationsProps["eyeColor"],
          })
        }
      />
    </div>
  );
}
