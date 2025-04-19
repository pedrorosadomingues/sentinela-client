/* eslint-disable @next/next/no-img-element */
"use client";

import { useFnStore } from "@/stores/fnStore";
import { UnfoldMoreOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

export default function CompareImage({
  isCompare,
}: {
  isCompare: boolean;
}) {
  const t = useTranslations("functions.page");

  const { original, generated, enhanced } = useFnStore().currentGeneration;
  const { activeEnhancement } = useFnStore();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));

    setSliderPosition(percent);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      {isCompare ? (
        <div className="relative group w-full h-full" onMouseUp={handleMouseUp}>
          <div
            className="relative m-auto overflow-hidden select-none"
            onMouseMove={handleMove}
            onMouseDown={handleMouseDown}
          >
            <img
              className="w-full h-full min-h-80 object-contain aspect-video"
              alt="initial image"
              draggable={false}
              src={enhanced && activeEnhancement ? enhanced : generated ?? ""}
            />
            <span className="w-fit absolute bottom-1 right-1 p-1 bg-black text-white text-xs bg-opacity-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              {t("generated_image")}
            </span>
            <div
              className="absolute top-0 left-0 right-0 w-full m-auto overflow-hidden select-none"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                draggable={false}
                className="w-full h-full min-h-80 object-contain aspect-video"
                alt="generated image"
                src={original ?? ""}
              />
              <span className="w-fit absolute top-1 left-1 p-1 bg-black text-white text-xs bg-opacity-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                {t("original_image")}
              </span>
            </div>
            <div
              className="absolute top-0 bottom-0 "
              style={{
                left: `calc(${sliderPosition}% - 1px)`,
              }}
            >
              <div className="flex items-center justify-center cursor-pointer bg-grayscale-100/90 group-hover:bg-white group-hover:transition-colors absolute rounded-full h-10 w-10 -left-4 top-[calc(50%-16px)]">
                <UnfoldMoreOutlined
                  className="rotate-90 fill-grayscale-600"
                  fontSize="large"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <img
          src={enhanced && activeEnhancement ? enhanced : generated ?? ""}
          alt="redraw generated image"
          className={`w-full h-full min-h-80 object-contain aspect-video`}
        />
      )}
    </>
  );
}
