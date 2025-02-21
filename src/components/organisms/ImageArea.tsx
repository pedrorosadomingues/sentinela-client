/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, Card, CardBody, CardHeader, Tooltip } from "@heroui/react";
import { CloseOutlined, RotateLeftOutlined, ImageOutlined, SentimentSatisfiedAltOutlined } from "@mui/icons-material";
import StepNumber from "@/components/atoms/StepNumber";

interface ImageAreaProps {
  image_path: string;
  setImageWidth: React.Dispatch<React.SetStateAction<number>>;
  onClearImage: (type: string) => void;
  type: "model" | "garment" | "result"; // Tipo de imagem.
  stepNumber: number;
  stepLabel: string;
  noImageMessage: string; // Mensagem quando não há imagem.
  showResetButton?: boolean; // Mostrar botão Reset para o tipo "result".
  resetTooltipText?: string; // Texto do tooltip para o botão Reset.
}

export const ImageArea: React.FC<ImageAreaProps> = ({
  image_path,
  setImageWidth,
  onClearImage,
  type,
  stepNumber,
  stepLabel,
  noImageMessage,
  showResetButton = false,
  resetTooltipText = "Reset",
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [renderedWidth, setRenderedWidth] = useState<number>(320);

  useEffect(() => {
    if (imageRef.current) {
      setRenderedWidth(imageRef.current.clientWidth);
      setImageWidth(imageRef.current.clientWidth);
    }
  }, [image_path]);

  return (
    <Card className="w-full pb-6 z-0" shadow="sm">
      <CardHeader className="w-full justify-center items-center mb-4">
        <StepNumber number={stepNumber} label={stepLabel} />
      </CardHeader>
      <CardBody className="w-full relative h-96">
        {image_path ? (
          <div className="w-full h-full bg-default-100 relative flex items-center justify-center">
            {/* Botões de ação no canto superior direito */}
            <nav className="flex flex-col gap-2 absolute top-2 right-2">
              {/* Botão Reset (opcional) */}
              {showResetButton && (
                <Tooltip content={resetTooltipText} placement="right" showArrow>
                  <Button
                    onPress={() => onClearImage("reset")}
                    color="danger"
                    size="sm"
                    isIconOnly
                    startContent={<RotateLeftOutlined fontSize="small" />}
                  />
                </Tooltip>
              )}
            </nav>
            <Image
              src={image_path}
              alt="Preview"
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
              {type === "result" ? (
                <ImageOutlined fontSize="large" className="text-default/95 scale-150" />
              ) : (
                <SentimentSatisfiedAltOutlined fontSize="large" className="text-default/95 scale-150" />
              )}
            </div>
            <p className="row-span-1 text-center text-sm md:text-xs lg:text-sm text-default-600 font-medium">
              {noImageMessage}
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
