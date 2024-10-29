import React from "react";
import Image from "next/image";

interface ModelImageAreaProps {
  model_image_path: string;
  openFileDialog: (type: string) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, type: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  modelInputRef: React.RefObject<HTMLInputElement>;
}

export default function ModelImageArea({
  model_image_path,
  openFileDialog,
  handleDrop,
  handleDragOver,
  handleFileInputChange,
  modelInputRef,
}: ModelImageAreaProps) {
  return (
    <div className="mb-5">
      <label>Select Model</label>
      <div
        className="upload-area"
        onClick={() => openFileDialog("model")}
        onDrop={(e) => handleDrop(e, "model")}
        onDragOver={handleDragOver}
      >
        {model_image_path ? (
          <Image
            src={model_image_path}
            alt="Model Preview"
            width={150}
            height={150}
          />
        ) : (
          <p className="text-center w-[70%]">
            Paste/drop image here OR Choose file
          </p>
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
          border: 2px dashed #ccc;
          border-radius: 10px;
          width: 320px;
          height: 320px;
          cursor: pointer;
          text-align: center;
          color: #888;
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
