/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ModelImageAreaProps {
  model_image_path: string;
  openFileDialog: (type: string) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, type: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  modelInputRef: React.RefObject<HTMLInputElement>;
  setModelImageWidth: React.Dispatch<React.SetStateAction<number>>;
}

export default function ModelImageArea({
  model_image_path,
  openFileDialog,
  handleDrop,
  handleDragOver,
  handleFileInputChange,
  modelInputRef,
  setModelImageWidth,
}: ModelImageAreaProps) {
  const text = useTranslations("model_image_area");
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [renderedWidth, setRenderedWidth] = useState<number>(320);

  useEffect(() => {
    if (imageRef.current) {
      setRenderedWidth(imageRef.current.clientWidth);
      setModelImageWidth(imageRef.current.clientWidth);
    }
  }, [model_image_path]);

  return (
    <div className="mb-5 max-w-[320px]">
      <div className="flex items-center gap-[10px] mb-4">
        <Image src="/icons/number-one-red.ico" alt="1" width={24} height={24} />
        <label>{text("step1_send_model_image")}</label>
      </div>
      <div
        className="upload-area"
        onClick={() => openFileDialog("model")}
        onDrop={(e) => handleDrop(e, "model")}
        onDragOver={handleDragOver}
      >
        {model_image_path ? (
          <Image
            src={model_image_path}
            alt={text("model_preview_alt")}
            width={250}
            height={320}
            ref={imageRef}
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
              src="/images/render-traces-first-placeholder.png"
              alt="Placeholder"
              className="w-[300px] h-[300px]"
              width={300}
              height={300}
            />
            <p className="text-center w-[70%] text-[18px]">
              {text("drag_file_instruction")}
            </p>
            <span className="text-center text-[15px]">
              {text("or_click_to_choose_model_image")}
            </span>
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
      </div>

      <style jsx>{`
        .upload-area {
          display: flex;
          justify-content: center;
          align-items: center;
          border-width: 1px; 
          border-color: #E5E7EBFF; 
          border-style: solid; 
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
