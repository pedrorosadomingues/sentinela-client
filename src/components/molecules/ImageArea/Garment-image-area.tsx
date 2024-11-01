/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Image from "next/image";

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
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const [renderedWidth, setRenderedWidth] = React.useState<number>(320);

  React.useEffect(() => {
    if (imageRef.current) {
      setRenderedWidth(imageRef.current.clientWidth);
      setGarmentImageWidth(imageRef.current.clientWidth);
    }
  }, [garment_image_path]);

  return (
    <div className="mb-5">
      <label>Select Garment</label>
      <div
        className="upload-area"
        onClick={() => openFileDialog("garment")}
        onDrop={(e) => handleDrop(e, "garment")}
        onDragOver={handleDragOver}
      >
        {garment_image_path ? (
          <Image
            src={garment_image_path}
            alt="Garment Preview"
            width={250}
            height={320}
            style={{ height: "100%", width: "auto", borderRadius: "10px" }}
          />
        ) : (
          <p className="text-center w-[70%]">
            Paste/drop image here OR Choose file
          </p>
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
          border: 2px dashed #ccc;
          border-radius: 10px;
          width: 320px;
          min-height: 320px;
          max-height: 550px;
          height: {renderedWidth}px;
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
