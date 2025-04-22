import React, { useState } from "react";
//import { StarGroup } from "../../icons";
import { useFnStore } from "@/stores/fnStore";
import { useTranslations } from "next-intl";
import { ImageOutlined, PhotoFilterOutlined } from "@mui/icons-material";

export default function OriginalImageButton() {
  const t = useTranslations("functions.page");
  const [active, toggleActive] = useState(false);
  const {
    setShowOriginalImage,
    showOriginalImage,
    activeGeneratorButton,
    setActiveGeneratorButton,
    selectedGeneratorButton,
    setSelectedGeneratorButton,
    setIsCompare,
  } = useFnStore();

  return (
    <div
      className={`relative`}
      onMouseEnter={() => setActiveGeneratorButton("original_image")}
    >
      <button
        className={`btn relative overflow-hidden h-10 border-2 rounded ${
          activeGeneratorButton === "original_image"
            ? "pr-3 pl-3 sm:px-4"
            : "pr-3 pl-3 sm:pr-0 sm:pl-2.5"
        }
            ${
              selectedGeneratorButton === "original_image"
                ? "bg-grayscale-600 text-white"
                : "bg-white hover:bg-grayscale-300/50"
            }`}
        onClick={() => {
          if(selectedGeneratorButton === "original_image") {
            toggleActive(!active);
          };
            
          setShowOriginalImage(!showOriginalImage);
          setIsCompare(false);
          setSelectedGeneratorButton("original_image");
        }}
      >
        <div
          aria-hidden="true"
          className={`transition duration-300 relative ${
            active ? "-translate-y-9" : ""
          }`}
        >
          <div className="h-9 flex items-center justify-center absolute">
            <ImageOutlined width={24} height={24} />
            <span
              className={`hidden sm:block ml-2 overflow-hidden text-sm whitespace-nowrap transition-all duration-600 ease-in-out ${
                activeGeneratorButton === "original_image"
                  ? "sm:max-w-xs"
                  : "sm:max-w-0 text-xs"
              }`}
            >
              {t("original_image")}
            </span>
          </div>
          <div className="h-9 flex items-center justify-center relative top-9">
            <PhotoFilterOutlined width={24} height={24} />
            <span
              className={`hidden sm:block ml-2 overflow-hidden text-sm whitespace-nowrap transition-all duration-600 ease-in-out ${
                activeGeneratorButton === "original_image"
                  ? "sm:max-w-xs"
                  : "sm:max-w-0 text-xs"
              }`}
            >
              {t("generated_image")}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
