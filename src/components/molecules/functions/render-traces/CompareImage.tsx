/* eslint-disable @next/next/no-img-element */
"use client";

import { useFnStore } from "@/stores/fnStore";
import { UnfoldMoreOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";

export default function CompareImage({ isCompare }: { isCompare: boolean }) {
  const t = useTranslations("functions.page");

  const { original, generated, enhanced } = useFnStore().currentGeneration;
  const { activeEnhancement } = useFnStore();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayedImage = enhanced && activeEnhancement ? enhanced : generated ?? "";

  const handleMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <>
      {isCompare ? (
        <div
          ref={containerRef}
          className="relative group w-full flex justify-center items-center bg-white"
          onMouseUp={handleMouseUp}
          onMouseMove={handleMove}
          onMouseDown={handleMouseDown}
          style={{ overflow: "hidden" }}
        >
          <div className="relative w-fit h-fit">
            {/* Imagem gerada como base */}
            <img
              src={displayedImage}
              alt="generated"
              draggable={false}
              className="max-w-full max-h-[90vh] object-contain block"
              style={{ backgroundColor: "white" }}
            />
            <span className="absolute bottom-1 right-1 p-1 bg-black text-white text-xs bg-opacity-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              {t("generated_image")}
            </span>

            {/* Imagem original sobreposta com clip */}
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={original ?? ""}
                alt="original"
                draggable={false}
                className="max-w-full max-h-[90vh] object-contain block h-full w-full"
                style={{ backgroundColor: "white" }}
              />
              <span className="absolute top-1 left-1 p-1 bg-black text-white text-xs bg-opacity-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                {t("original_image")}
              </span>
            </div>

            {/* Slider */}
            <div
              className="absolute top-0 bottom-0 z-50"
              style={{
                left: `calc(${sliderPosition}% - 1px)`,
              }}
            >
              <div className="flex items-center justify-center cursor-pointer bg-white group-hover:bg-black transition-colors absolute rounded-full h-10 w-10 -left-4 top-[calc(50%-20px)] shadow-md">
                <UnfoldMoreOutlined
                  className="rotate-90 fill-black group-hover:fill-white"
                  fontSize="large"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full flex justify-center items-center bg-white">
          <img
            src={displayedImage}
            alt="generated"
            draggable={false}
            className="max-w-full max-h-[90vh] object-contain block"
            style={{ backgroundColor: "white" }}
          />
        </div>
      )}
    </>
  );
}
