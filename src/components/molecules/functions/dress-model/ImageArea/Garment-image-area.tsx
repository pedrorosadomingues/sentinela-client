/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface GarmentImageAreaProps {
  garment_image_path: string;
  openFileDialog: (type: string) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, type: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  garmentInputRef: React.RefObject<HTMLInputElement>;
  setGarmentImageWidth: React.Dispatch<React.SetStateAction<number>>;
}

export default function GarmentImageArea({
  garment_image_path,
  openFileDialog,
  handleDrop,
  handleDragOver,
  handleFileInputChange,
  garmentInputRef,
  setGarmentImageWidth,
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
    <div className="max-w-[320px] min-w-[320px min935:h-[580px]">
      <div className="flex items-center justify-center gap-[10px] mb-4">
        <Image src="/icons/number-two-red.ico" alt="2" width={24} height={24} />
        <label>{text("step2_send_garment_image")}</label>
      </div>
      <div
        className="upload-area"
        onClick={() => openFileDialog("garment")}
        onDrop={(e) => handleDrop(e, "garment")}
        onDragOver={handleDragOver}
      >
        {garment_image_path ? (
          <Image
            src={garment_image_path}
            alt={text("garment_preview_alt")}
            width={250}
            height={320}
            style={{
              height: "100%",
              width: "auto",
              borderRadius: "10px",
              minHeight: "320px",
            }}
          />
        ) : (
          <div className="flex flex-col justify-center items-center w-full h-full">
            <Image
              src="/images/dress-model-second-placeholder.png"
              alt="upload"
              width={300}
              height={300}
            />
            <p className="text-center w-[70%] text-[18px]">
              {text("drag_file_instruction")}
            </p>
            <span className="text-center text-[15px]">
              {text("or_click_to_choose_garment_image")}
            </span>
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
      </div>

      <style jsx>{`
        .upload-area {
          display: flex;
          justify-content: center;
          align-items: center;
          border-width: 1px; 
          border-color: #E5E7EBFF; 
          border-style: solid; 
          border-radius: 10px;
          box-shadow: 0px 0px 1px
          width: 320px;
          min-height: 450px;
          max-height: 550px;
          cursor: pointer;
          text-align: center;
          color: #888;
          overflow: hidden;
          padding: 10px;
        }
        .upload-area p {
          margin: 0;
        }
        .upload-area:hover {
          border-color: #888;
        }
      `}</style>
    </div>
  );
}
