import React from "react";
import { ExpandLess } from "@mui/icons-material";

interface ColorSelectorProps {
  colors: string[];
  selectedColor?: string;
  onSelectColor: (color: string) => void;
}

export function ColorSelector({ colors, selectedColor, onSelectColor }: ColorSelectorProps) {
  return (
    <div className="flex gap-1 overflow-x-scroll pb-4 overflow-y-hidden">
      {colors.map((color) => (
        <button
          key={color}
          className="border border-default-400/50 relative rounded-full flex items-end justify-center cursor-pointer"
          onClick={() => onSelectColor(color)}
        >
          <div
            style={{ backgroundColor: color }}
            className="rounded-full w-6 h-6 md:w-8 md:h-8"
          />
          {selectedColor === color && <ExpandLess className="absolute -bottom-5 text-default-400" />}
        </button>
      ))}
    </div>
  );
}
