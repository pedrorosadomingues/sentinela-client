/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";

interface ResultImageAreaProps {
  result_image_path: string;
  setResultImageWidth: React.Dispatch<React.SetStateAction<number>>;
}

const ResultImageArea: React.FC<ResultImageAreaProps> = ({
  result_image_path,
  setResultImageWidth,
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [renderedWidth, setRenderedWidth] = useState<number>(320);

  useEffect(() => {
    if (imageRef.current) {
      setRenderedWidth(imageRef.current.clientWidth);
      setResultImageWidth(imageRef.current.clientWidth);
    }
  }, [result_image_path]);

  return (
    <div className="mb-5">
      <label>Result</label>
      <div className="result-area">
        {result_image_path ? (
          <img
            src={result_image_path}
            alt="Result Preview"
            style={{ height: "100%", width: "auto", borderRadius: "10px" }}
            ref={imageRef}
            width={250}
            height={320}
          />
        ) : (
          <p className="text-center w-[70%]">image</p>
        )}
      </div>
      <style jsx>{`
        .result-area {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px dashed #ccc;
          border-radius: 10px;
          width: 320px;
          min-height: 320px;
          height: {renderedWidth}px;
          max-height: 550px;
          text-align: center;
          color: #888;
          overflow: hidden;
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

export default ResultImageArea;
