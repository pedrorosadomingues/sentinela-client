/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import "react-image-crop/dist/ReactCrop.css";

import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { useRef, useCallback } from "react";

interface ReactCropperProps {
  image: string;
  reactCrop: Crop | any;
  setReactCrop: (reactCrop: Crop) => void;
  setReactCropAreaPixels: (reactCrop: PixelCrop) => void;
  onCropComplete: (croppedImage: string) => void; // Nova propriedade
}

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Erro ao obter contexto do canvas.");
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return canvas.toDataURL("image/jpeg");
}

export default function ReactCropper({
  image,
  reactCrop,
  setReactCrop,
  setReactCropAreaPixels,
  onCropComplete,
}: ReactCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      setReactCrop({
        unit: "px",
        x: 10,
        y: 10,
        width: width * 0.8,
        height: height * 0.8,
      });
    },
    [setReactCrop]
  );

  const handleCropComplete = useCallback(
    (crop: PixelCrop) => {
      if (imgRef.current && crop.width && crop.height) {
        const croppedImg = getCroppedImg(imgRef.current, crop);
        onCropComplete(croppedImg); // Chama o callback com a imagem recortada
      }
    },
    [onCropComplete]
  );

  return (
    <>
      <ReactCrop
        crop={reactCrop}
        onChange={(newCrop) => setReactCrop(newCrop)}
        onComplete={(c) => {
          setReactCropAreaPixels(c);
          handleCropComplete(c);
        }}
        keepSelection={true}
        className="h-96 object-contain"
      >
        <img
          ref={imgRef}
          alt="Recortar Imagem"
          src={image}
          className="h-96 object-contain"
          onLoad={onImageLoad}
        />
      </ReactCrop>
    </>
  );
}
