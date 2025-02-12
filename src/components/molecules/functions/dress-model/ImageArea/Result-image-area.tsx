/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button, Card, CardBody, CardHeader, Tooltip } from "@heroui/react";
import {
  ImageOutlined,
  RotateLeftOutlined,
} from "@mui/icons-material";
import StepNumber from "@/components/atoms/StepNumber";

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
    <Card className="w-full pb-6 z-0" shadow="sm">
      <CardHeader className="w-full justify-center items-center mb-4">
        <StepNumber number={3} label={text("step3_your_image")} />
      </CardHeader>
      <CardBody className="w-full relative result-area h-96">
        {result_image_path ? (
          <div className="w-full h-full bg-default-100 relative flex items-center justify-center">
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
              className="object-contain w-full aspect-square max-h-full"
            />
          </div>
        ) : (
          <div className="grid grid-rows-4 grid-cols-1 w-full h-full place-items-center">
            <div className="row-span-3 col-span-full flex items-center justify-center border-[24px] border-default/25 rounded-full w-40 h-40">
              <ImageOutlined
                fontSize="large"
                className="text-default/95 scale-150"
              />
            </div>
            <p className="row-span-1 text-center text-sm md:text-xs lg:text-sm text-default-600 font-medium">
              {text("your_image_will_be_displayed_here")}
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
