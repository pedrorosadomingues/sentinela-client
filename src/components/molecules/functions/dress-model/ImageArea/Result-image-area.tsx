/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button, Tooltip } from "@heroui/react";
import {
  CloseOutlined,
  DeleteSweepOutlined,
  RemoveOutlined,
  RotateLeftOutlined,
} from "@mui/icons-material";
import StepNumber from "@/components/atoms/StepNumber";
import { useDressModelStore } from "@/zustand-stores/dressModelStore";

interface ResultImageAreaProps {
  result_image_path: string;
  setResultImageWidth: React.Dispatch<React.SetStateAction<number>>;
  onClearImage: (type: "model" | "garment" | "result" | "reset") => void;
}

export default function ResultImageArea({
  result_image_path,
  setResultImageWidth,
  onClearImage,
}: ResultImageAreaProps): JSX.Element {
  const { step, current, setStep } = useDressModelStore();
  const text = useTranslations("result_image_area");
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [renderedWidth, setRenderedWidth] = useState<number>(320);

  useEffect(() => {
    if (imageRef.current) {
      setRenderedWidth(imageRef.current.clientWidth);
      setResultImageWidth(imageRef.current.clientWidth);
    }
  }, [result_image_path]);

  return (
    <div className="w-full">
      <div className="w-full flex justify-center items-center mb-4">
        <StepNumber number={3} label={text("step3_your_image")} />
      </div>
      <div className="relative result-area">
        {result_image_path ? (
          <>
            <nav className="flex flex-col gap-2 absolute top-2 right-2">
              <Tooltip
                content={text("reset_images")}
                placement="right"
                showArrow
              >
                <Button
                  onPress={() => onClearImage("reset")}
                  color="danger"
                  size="sm"
                  isIconOnly
                  // isDisabled={}
                  startContent={<RotateLeftOutlined fontSize="small" />}
                />
              </Tooltip>
            </nav>
            <Image
              src={result_image_path}
              alt={text("result_preview_alt")}
              style={{ height: "100%", width: "auto", borderRadius: "10px" }}
              ref={imageRef}
              width={250}
              height={320}
              unoptimized
              className="object-contain w-full aspect-square"
            />
          </>
        ) : (
          <p className="text-center w-[70%]">
            <Image
              src="/images/dress-model-third-placeholder.png"
              alt="placeholder"
              width={300}
              height={300}
            />
            {text("your_image_will_be_displayed_here")}
          </p>
        )}
      </div>
      <style jsx>{`
        .result-area {
          display: flex;
          justify-content: center;
          align-items: center;
          border-width: 1px; 
          border-color: #E5E7EBFF; 
          border-style: solid; 
          border-radius: 6px;
          box-shadow: 0px 0px 1px
          max-width: 320px;
          min-height: 450px;
          max-height: 550px;
          text-align: center;
          color: #888;
          overflow: hidden;
          padding: 10px;
        }
      `}</style>
    </div>
  );
}
