/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button, Card, CardBody, CardHeader, Tooltip } from "@heroui/react";
import { CheckroomOutlined, CloseOutlined } from "@mui/icons-material";
import StepNumber from "@/components/atoms/StepNumber";
import { useDressModelStore } from "@/zustand-stores/dressModelStore";

interface GarmentImageAreaProps {
  garment_image_path: string;
  openFileDialog: (type: string) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, type: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  garmentInputRef: React.RefObject<HTMLInputElement>;
  setGarmentImageWidth: React.Dispatch<React.SetStateAction<number>>;
  onClearImage: (type: "model" | "garment" | "result") => void;
}

export default function GarmentImageArea({
  garment_image_path,
  openFileDialog,
  handleDrop,
  handleDragOver,
  handleFileInputChange,
  garmentInputRef,
  setGarmentImageWidth,
  onClearImage,
}: GarmentImageAreaProps): JSX.Element {
  const text = useTranslations("garment_image_area");
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const [renderedWidth, setRenderedWidth] = React.useState<number>(320);

  React.useEffect(() => {
    if (imageRef.current) {
      setRenderedWidth(imageRef.current.clientWidth);
      setGarmentImageWidth(imageRef.current.clientWidth);
    }
  }, [garment_image_path]);

  return (
    <Card className="w-full pb-6 select-none z-0" shadow="sm">
      <CardHeader className="w-full justify-center items-center mb-4">
        <StepNumber number={2} label={text("step2_send_garment_image")} />
      </CardHeader>
      <CardBody
        className="cursor-pointer relative upload-area h-96"
        onClick={() => openFileDialog("garment")}
        onDrop={(e) => handleDrop(e, "garment")}
        onDragOver={handleDragOver}
      >
        {garment_image_path ? (
          <div className="w-full h-full bg-default-100 relative">
            <Tooltip content={text("clear_image")} placement="right" showArrow>
              <Button
                onPress={() => onClearImage("garment")}
                color="danger"
                size="sm"
                isIconOnly
                // isDisabled={}
                startContent={<CloseOutlined fontSize="small" />}
                className="absolute top-2 right-2"
              />
            </Tooltip>
            <Image
              src={garment_image_path}
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
