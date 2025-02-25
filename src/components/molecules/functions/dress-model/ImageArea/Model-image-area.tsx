/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button, Card, CardBody, CardHeader, Tooltip } from "@heroui/react";
import {
  CloseOutlined,
  SentimentSatisfiedAltOutlined,
} from "@mui/icons-material";
import StepNumber from "@/components/atoms/StepNumber";
import ToolInfo from "@/components/atoms/ToolInfo";
import { useDressModelStore } from "@/stores/dressModelStore";

interface ModelImageAreaProps {
  src: string;
  openFileDialog: (type: string) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, type: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  modelInputRef: React.RefObject<HTMLInputElement>;
  onClearImage: (type: "model" | "garment" | "result") => void;
}

export default function ModelImageArea({
  src,
  openFileDialog,
  handleDrop,
  handleDragOver,
  handleFileInputChange,
  modelInputRef,
  onClearImage,
}: ModelImageAreaProps) {
  const text = useTranslations("model_image_area");
  const { currentGeneration } = useDressModelStore();
  const imageRef = useRef<HTMLImageElement | null>(null);

  return (
    <Card className="w-full pb-6 z-0 dt-second-step dt-third-step" shadow="sm">
      <CardHeader className="w-full justify-center items-center gap-2 mb-4">
        <StepNumber number={1} label={text("step1_send_model_image")} />{" "}
        <ToolInfo
          title="lorem ipsum dolor"
          text="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
          video="https://redrawacademy.s3.sa-east-1.amazonaws.com/videos/tutorial/suggestions.mp4"
          href="https://academy.arch.redraw.pro/"
        />
      </CardHeader>
      <CardBody
        className="cursor-pointer relative upload-area h-96"
        onDrop={(e) => handleDrop(e, "model")}
        onDragOver={handleDragOver}
        onClick={() => openFileDialog("model")}
      >
        {src ? (
          <div className="w-full h-full bg-default-100 relative">
            <Tooltip content={text("clear_image")} placement="right" showArrow>
              <Button
                onPress={() => onClearImage("model")}
                color="danger"
                size="sm"
                isIconOnly
                isDisabled={currentGeneration.isLoading}
                startContent={<CloseOutlined fontSize="small" />}
                className="absolute top-2 right-2"
              />
            </Tooltip>
            <Image
              src={src}
              alt={text("model_preview_alt")}
              width={250}
              height={320}
              ref={imageRef}
              unoptimized
              className="object-contain w-full aspect-square max-h-full"
            />
          </div>
        ) : (
          <div className="grid grid-rows-4 grid-cols-1 w-full h-full place-items-center">
            <div className="row-span-3 col-span-full flex items-center justify-center border-[24px] border-default/25 rounded-full w-40 h-40">
              <SentimentSatisfiedAltOutlined
                fontSize="large"
                className="text-default/95 scale-150"
              />
            </div>
            <div className="row-span-1 space-y-2 text-center xs:w-3/4">
              <p className="text-center text-sm md:text-xs lg:text-sm text-default-600 font-medium">
                {text("drag_file_instruction")}
              </p>
              <span className="text-center text-xs mt-2 text-default-500">
                {text("or_click_to_choose_model_image")}
              </span>
            </div>
          </div>
        )}
        <input
          type="file"
          name="model_image"
          onChange={handleFileInputChange}
          accept="image/*"
          ref={modelInputRef}
          hidden
        />
      </CardBody>
    </Card>
  );
}
