/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ResultImageAreaProps {
  result_image_path: string;
  setResultImageWidth: React.Dispatch<React.SetStateAction<number>>;
}

export default function ResultImageArea({
  result_image_path,
  setResultImageWidth,
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
    <div className="mb-5 max-w-[320px]">
      <div className="flex items-center gap-[10px] mb-4">
        <Image
          src="/icons/number-three-red.ico"
          alt="3"
          width={24}
          height={24}
        />
        <label>{text("step3_your_image")}</label>
      </div>
      <div className="result-area">
        {result_image_path ? (
          <img
            src={result_image_path}
            alt={text("result_preview_alt")}
            style={{ height: "100%", width: "auto", borderRadius: "10px" }}
            ref={imageRef}
            width={250}
            height={320}
          />
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
          border-radius: 10px;
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
