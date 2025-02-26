/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button, Card, CardBody, CardHeader, Tooltip } from "@heroui/react";
import { CheckroomOutlined, CloseOutlined } from "@mui/icons-material";
import StepNumber from "@/components/atoms/StepNumber";
import ToolInfo from "@/components/atoms/ToolInfo";
import { useDressModelStore } from "@/stores/dressModelStore";

interface GarmentImageAreaProps {
  src: string;
  openFileDialog: (type: string) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, type: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  garmentInputRef: React.RefObject<HTMLInputElement>;
  onClearImage: (type: "model" | "garment" | "result") => void;
}

export default function GarmentImageArea({
  src,
  openFileDialog,
  handleDrop,
  handleDragOver,
  handleFileInputChange,
  garmentInputRef,
  onClearImage,
}: GarmentImageAreaProps): JSX.Element {
  const text = useTranslations("garment_image_area");
  const { currentGeneration } = useDressModelStore();

  return (
    <Card className="w-full pb-6 select-none z-0 dt-ninth-step" shadow="sm">
      <CardHeader className="w-full justify-center items-center gap-2 mb-4">
        <StepNumber number={2} label={text("step2_send_garment_image")} />
        <ToolInfo
          title="lorem ipsum dolor"
          text="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
          video="https://fcoyipufipefrxnqwqbs.supabase.co/storage/v1/object/public/media/videos/select-garment.mp4"
          href="#"
        />
      </CardHeader>
      <CardBody
        className="dt-tenth-step cursor-pointer relative upload-area h-96"
        onClick={() => openFileDialog("garment")}
        onDrop={(e) => handleDrop(e, "garment")}
        onDragOver={handleDragOver}
      >
        {src ? (
          <div className="w-full h-full bg-default-100 relative">
            <Tooltip content={text("clear_image")} placement="right" showArrow>
              <Button
                onPress={() => onClearImage("garment")}
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
              alt={text("garment_preview_alt")}
              width={250}
              height={320}
              unoptimized
              className="object-contain w-full aspect-square max-h-full"
            />
          </div>
        ) : (
          <div className="grid grid-rows-4 grid-cols-1 w-full h-full place-items-center">
            <div className="row-span-3 col-span-full flex items-center justify-center border-[24px] border-default/25 rounded-full w-40 h-40">
              <CheckroomOutlined
                fontSize="large"
                className="text-default/95 scale-150"
              />
            </div>

            <div className="row-span-1 space-y-2 text-center">
              <p className="text-center text-sm md:text-xs lg:text-sm text-default-600 font-medium">
                {text("drag_file_instruction")}
              </p>
              <span className="text-center text-xs mt-2 text-default-500">
                {text("or_click_to_choose_garment_image")}
              </span>
            </div>
          </div>
        )}

        <input
          type="file"
          name="garment_image"
          onChange={handleFileInputChange}
          accept="image/*"
          ref={garmentInputRef}
          hidden
        />
      </CardBody>
    </Card>
  );
}
