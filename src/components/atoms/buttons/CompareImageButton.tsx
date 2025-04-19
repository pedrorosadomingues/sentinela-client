import React from "react";
import { useFnStore } from "@/stores/fnStore";
import { useTranslations } from "next-intl";
import { CompareOutlined } from "@mui/icons-material";

export default function CompareImageButton() {
  const t = useTranslations("functions.page");
  const {
    setShowOriginalImage,
    activeGeneratorButton,
    setActiveGeneratorButton,
    isCompare,
    setIsCompare,
    selectedGeneratorButton,
    setSelectedGeneratorButton,
  } = useFnStore();

  return (
    <div
      className={`relative`}
      onMouseEnter={() => setActiveGeneratorButton("compare_result")}
    >
      <button
        className={`btn relative overflow-hidden h-10 border-2 rounded ${
          activeGeneratorButton === "compare_result"
            ? "pr-3 pl-3 sm:px-4"
            : "pr-3 pl-3 sm:pr-0 sm:pl-2.5"
        }
          ${
            selectedGeneratorButton === "compare_result"
              ? "bg-grayscale-600 text-white"
              : "bg-white hover:bg-grayscale-300/50"
          }
          `}
        onClick={() => {
          setIsCompare(!isCompare);
          setShowOriginalImage(false);
          setSelectedGeneratorButton("compare_result");
        }}
      >
        <div
          aria-hidden="true"
          className={`transition duration-300 relative
          `}
        >
          <div className="h-9 flex items-center justify-center">
            <CompareOutlined width={24} height={24} />
            <span
              className={`hidden sm:block ml-2 overflow-hidden text-sm whitespace-nowrap transition-all duration-600 ease-in-out ${
                activeGeneratorButton === "compare_result"
                  ? "sm:max-w-xs"
                  : "sm:max-w-0 text-xs"
              }`}
            >
              {t("compare_result")}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
