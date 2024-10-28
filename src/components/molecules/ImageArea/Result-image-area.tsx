import React from "react";
import Image from "next/image";

interface ResultImageAreaProps {
  result_image_path: string;
}

const ResultImageArea: React.FC<ResultImageAreaProps> = ({
  result_image_path,
}) => {
  return (
    <div className="mb-5">
      <label>Result Image</label>
      <div className="h-min-[420px] result-area">
        {result_image_path ? (
          <Image
            src={result_image_path}
            alt="Result Preview"
            width={150}
            height={150}
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
          height: 420px;
          cursor: pointer;
          text-align: center;
          color: #888;
        }
      `}</style>
    </div>
  );
};

export default ResultImageArea;
