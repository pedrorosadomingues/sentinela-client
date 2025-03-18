import { useCreateModelStore } from "@/stores/createModelStore";
import { ExpandLess } from "@mui/icons-material";
import React from "react";

export function Skin() {
  const { selectedCustomizations, setSelectedCustomizations } =
    useCreateModelStore();

  const skinTones = [
    "#FDE7D6",
    "#F8D9BF",
    "#F5C8A5",
    "#F2B690",
    "#EDA57E",
    "#E6936B",
    "#D88359",
    "#C97146",
    "#B7623D",
    "#A15333",
    "#8B422A",
    "#733122",
    "#5A201A",
    "#421310",
  ];

  const handleSelectSkinTone = (color: string) => {
    setSelectedCustomizations({
      ...selectedCustomizations,
      skinTone: color,
    });
  };

  return (
    <div className="flex gap-1 overflow-x-scroll pb-4 overflow-y-hidden">
      {skinTones.map((color) => (
        <button
          key={color}
          className={`border border-default-400/50 relative rounded-full flex items-end justify-center cursor-pointer`}
          onClick={() => handleSelectSkinTone(color)}
        >
          <div
            style={{ backgroundColor: color }}
            className="rounded-full w-6 h-6 md:w-8 md:h-8"
          />

          {selectedCustomizations?.skinTone === color && (
            <ExpandLess className="absolute -bottom-5 text-default-400" />
          )}
        </button>
      ))}
    </div>
  );
}
